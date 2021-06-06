const express = require('express');
const moment = require('moment');
const router = express.Router();
const { getStatistics, userSyndromes, getAdminCharts, getAllUsers, getTimi, getSyndromi, insertSyndromi, getUsers, updateProfile, getEmail, getVerification, updatePassword, deletePlano, getPlano, insertUser, insertPlano, getVaros, getVarosProgress, authenticateUser, insertPersonalData, insertGoalsData, getWorkouts, insertWorkout, RemoveWorkout, getWorkoutsOfWeek } = require('./lib/dbconfig');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
require('dotenv').config(); //To dotenv χρειάζεται για να βλέπω το .env αρχείο
const jwt = require('jsonwebtoken');


//Για να μην κάνει cache την σελίδα και να μην μπορείς να κάνεις access με back button μετα το logout
router.use(function (req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});


//AUTHENTICATE USER
router.get('/authentication', async (req, res) => {
    let user = await getUsers(req.session.email);
    if (typeof user === "undefined") {
        res.json({ auth: 'false' });
    } else {
        res.json({ auth: 'true' });
    }
})

//HOME + ADMIN USER LIST
router.get('/', async (req, res) => {

    let url = 'home';
    let authUrl = 'userHome';
    

    await authenticateUser(req.session.email, url, authUrl, async (page) => {
        if (page == url) {
            res.render(page, {
                style: 'main_website/css/home-css.css'

            });

        }
        else {
            let user = await getUsers(req.session.email);
            if (typeof user != undefined) {
                if (user.isadmin) {
                    userList = await getAllUsers();
                    let syndromes = await userSyndromes(userList); //Συνάρτηση που επιστρέφει έναν πίνακα με όλες τις ενεργές συνδρομές του χρήστη για την Admin User List
                    for (let i = 0; i < userList.length; i++) {
                        userList[i]['syndromes'] = syndromes[i]
                    }

                    res.render('adminUserList', {
                        style: 'admin/css/adminUserList.css',
                        layout: 'admin-layout',
                        userList: userList,
                    });
                } else {


                    res.render(page, {
                        style: 'user/css/user-home-css.css',
                        layout: 'user-layout',
                        userEmail: user.email.substring(0, user.email.lastIndexOf("@"))
                    });
                }

            }
        }

    });
});


//SERVICES 
router.get('/services-html', async (req, res) => {
    let url = 'services';
    let authUrl = 'authservices';
    await authenticateUser(req.session.email, url, authUrl, (page) => {
        if (page == url) {
            res.render(url, {
                style: 'main_website/css/services-css.css'
            })
        } else {
            res.render(url, {
                style: 'main_website/css/services-css.css',
                layout: 'user-layout'
            })
        }
    });
});

//ABOUT
router.get('/about-html', async (req, res) => {
    let url = 'about';
    let authUrl = 'authabout';
    await authenticateUser(req.session.email, url, authUrl, (page) => {
        if (page == url) {
            res.render(url, {
                style: 'main_website/css/about-css.css'
            })
        } else {
            res.render(url, {
                style: 'main_website/css/about-css.css',
                layout: 'user-layout'
            })
        }
    });

});

//ΠΡΟΓΡΑΜΜΑ 
router.get('/program-html', async (req, res) => {
    let url = 'program';
    let authUrl = 'authprogram';
    await authenticateUser(req.session.email, url, authUrl, async (page) => {
        if (page == url) {
            res.render('program', {
                style: 'main_website/css/program-css.css'
            })
        } else {
            let user = await getUsers(req.session.email);
            if (typeof user != undefined) {   
                const plana = await getPlano(user.id_melous); //Μέσω της getPlano κάνουμε true και false τις παρακάτω μεταβλητές ανάλογα με το ποιά πλάνα "παρακολουθεί" ο χρήστης
                res.render(url, { //κάνει true όσα παρακολουθεί ο χρήστης μέσω handlebars 
                    style: 'main_website/css/program-css.css',
                    layout: 'user-layout',
                    user: req.session.email,
                    cross: plana.cross,
                    bodypump: plana.bodypump,
                    zumba: plana.zumba,
                    pilates: plana.pilates,
                    hipsabs: plana.hipsabs,
                    trx: plana.trx,
                    kickKids: plana.kickKids,
                    kickPro: plana.kickPro
                })
            }
        }
    });

});

//καλεί την insertPlano για προσθήκη πλάνου αν ο χρήστης το κάνει checked 
router.post('/addPlano', express.urlencoded({ extended: true }), async (req, res) => {

    const { plano } = req.body;
    await insertPlano(plano, req.session.email);
    res.send('ok');
});

//καλεί την deletePlano για διαγραφή πλάνου αν ο χρήστης το κάνει unchecked 
router.post('/removePlano', express.urlencoded({ extended: true }), async (req, res) => {

    const { plano } = req.body;
    await deletePlano(plano, req.session.email);
    res.send('ok');
});

//SUBSCRIPTIONS
router.get('/subscriptions-html', async (req, res) => {
    let url = 'subscriptions';
    let authUrl = 'authsubscriptions';
    await authenticateUser(req.session.email, url, authUrl, async (page) => {
        if (page == url) {
            res.render(url, {
                style: 'main_website/css/subscriptions-css.css'
            })
        } else {
            let syndromi = await getSyndromi(req.session.email); 
//Η συνάρτηση getSyndromi ελέγχει ποιές είναι οι ενεργές συνδρομές του χρήστη ώστε μέσω ελέγχου στα hbs να τυπώνεται το μήνυμα "η συνδρομή μου"
            res.render(url, {
                style: 'main_website/css/subscriptions-css.css',
                layout: 'user-layout',
                Monthly: syndromi.MonthlyOrgana, 
                Yearly: syndromi.YearlyOrgana,
                kickKids: syndromi.kickKids,
                kickPro: syndromi.kickPro,
            })
        }
    });
});



//ΑΓΟΡΑ ΣΥΝΔΡΟΜΗΣ
router.post('/addSyndromi', async (req, res) => {

    const { date, id, code } = req.body

    let startdate = moment(date).format('YYYY-MM-DD')
    let enddate;
    let user = await getUsers(req.session.email);
    if (code == "YearlyOrgana") {
        enddate = moment(date).add(1, 'year').format('YYYY-MM-DD') //Άν αγοράστηκε η ετήσια συνδρομή, η ημερομηνια λήξης της είναι έναν χρόνο μετά. 
    } else {
        enddate = moment(date).add(1, 'month').format('YYYY-MM-DD')//Σε κάθε άλλη περίπτωση είναι έναν μήνα μετά

    }
    const bool = await insertSyndromi(user.id_melous, moment().format('YYYY-MM-DD'), startdate, enddate, code) //Εισαγωγή νέας συνδρομής στη βάση

    if (bool == true) {
        res.json({ status: 'success' })
    } else {
        res.json({ status: "error" })
    }

});



router.get('/subPayment/:id', async (req, res) => { 
//Έχοντας κρατήσει το id του κουμπιού αγοράς που μας μετέφερε στην σελίδα πληρωμών γνωρίζουμε σε ποια συνδρομή αντιστοιχεί ώστε να περάσουμε δυναμικά τα δεδομένα που χρειαζόμαστε
    let url = 'signin';
    let authUrl = 'payment';
    await authenticateUser(req.session.email, url, authUrl, async (page) => {
        if (page == url) {
            res.render(page, {
                style: '/main_website/css/signin-css.css'
            })
        }
        else {
            let user = await getUsers(req.session.email);
            if (typeof user != undefined) {
                let syndromi = await getTimi(req.params.id); //Βρίσκουμε τις πληροφορίες για την συνδρομή που είναι προς αγορά

                res.render(page, {
                    style: '/user/css/user-payment-css.css',
                    layout: 'user-layout',
                    fname: user.onoma + "\xa0" + user.epwnumo,
                    sEmail: user.email,
                    id: syndromi.onoma_syndromis,
                    price: syndromi.timi,
                    code: syndromi.code_syndromis


                })
            }
        }
    });

})


//CONTACT US
router.get('/contactus-html', async (req, res) => {
    let url = 'contactus';
    let authUrl = 'authcontactus';
    console.log(req.session.email);
    await authenticateUser(req.session.email, url, authUrl, async (page) => {
        if (page == url) {
            res.render(url, {
                style: 'main_website/css/contactus-css.css'
            })
        }
        else {
            let user = await getUsers(req.session.email);
            if (typeof user != undefined) {
                res.render(url, {
                    style: 'main_website/css/contactus-css.css',
                    layout: 'user-layout',
                    fname: user.onoma + "\xa0" + user.epwnumo, //αν ο χρήστης είναι συνδεδεμένος προσυμπληρώνει τα στοιχεία του στην φόρμα επικοινωνίας
                    sEmail: user.email

                })
            }
        }
    });

})
router.post('/sendemail', express.urlencoded({ extended: true }), (req, res) => {


    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.email,
            pass: process.env.password //Κάνω store τα gmail credentials σε ένα .env αρχείο για ασφάλεια
        }
    })
    const mailOptions = {
        from: req.body.email,
        to: 'k1danaos.gym@gmail.com',
        subject: `Φόρμα επικοινωνίας: μήνυμα από ${req.body.username}, email: ${req.body.email} `,
        text: req.body.message
    }


    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.json({ status: 'error' });
            console.log("Network error." + info)
        }
        else {
            console.log('Email sent:' + info.response)
            res.json({ status: 'success' });
        }
    }
    )
})




//ΣΥΝΔΕΣΗ ΧΡΗΣΤΗ

router.post('/signin', express.urlencoded({ extended: true }), async (req, res) => {
    const { email, password } = req.body;

    let user = await getUsers(email); //Αναμένουμε απο την getUsers να ελέγξει άν υπάρχει στη βάση email ίδιο με αυτό που πήραμε απο το req.body
    if (typeof user == "undefined") {  //Αν δεν υπάρχει χρήστης με αυτό το email επιστρέφει status: wrongEmail ώστε να τυπώθεί το κατάλληλο μήνυμα
        return res.json({ status: 'wrongEmail' });

    }
    else {
        const isMatch = await bcrypt.compare(password, user.kwdikos) //Η μέθοδος για να συγκρίνουμε τον κωδικό που έδωσε ο χρήστης στο input με τον hashed κωδικό στη βάση
 //πραγματοποιούμε τους αναγκαίους ελέγχους
        if (!isMatch) { 
            return res.json({ status: 'wrongPassword' });
        }
        else {
            if (!user.isconfirmed) {
                req.session.email = email;
                return res.json({ status: 'notactivated' });
            }
            else {
                req.session.email = email;
                res.json({ status: 'success' })
            }

        }

    }

});

router.get('/signin-html', async (req, res) => {
    let url = 'signin';
    let authUrl = 'userHome';
    let mystyle;

    await authenticateUser(req.session.email, url, authUrl, (page) => { // Άμα υπάρχει αρχικοποιημένο session πήγαινε στην σελίδα userHome αντί για την signin
        if (page == url) {
            mystyle = 'main_website/css/signin-css.css';
        }
        else {
            mystyle = 'user/css/user-home-css.css';
        }
        res.render(page, {
            style: mystyle
        });

    });
});


//ΣΥΝΔΕΣΗ ΧΡΗΣΤΗ-Υπενθύμιση κωδικού
router.post('/remindPass', async (req, res) => {
    const { email } = req.body;

    let user = await getUsers(email); //Ελέγχουμε με την συνάρτηση getUsers αν υπάρχει χρήστης με το email που μπήκε στο input
    if (typeof user == "undefined") {
        res.json({ status: 'NoEntries' });

    }

    //Δημιουργία τυχαίου κωδικού που αποτελείται απο έναν 6ψήφιο συνδυασμό των ψηφιών του characters
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    let pass = '';
    for (let i = 0; i < 6; i++) {
        pass += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    //κάνουμε hash τον κωδικό
    const hashpass = await bcrypt.hash(pass, 12)

    await updatePassword(email, hashpass);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.email,
            pass: process.env.password //Κάνω store τα gmail credentials σε ένα .env αρχείο για ασφάλεια
        }
    })


    const mailOptions = {
        from: 'k1danaos.gym@gmail.com',
        to: email,
        subject: "Υπενθύμιση κωδικού",
        text: `Ο νέος σας κωδικός είναι ${pass}.`
    }


    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.json({ status: 'error' });
            console.log("Network error." + info)
        }
        else {
            console.log('Email sent:' + info.response)
            res.json({ status: 'success' });
        }
    });
})


//ΑΠΟΣΥΝΔΕΣΗ
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) throw err;
        res.redirect("/");
    })

});


// ΕΓΓΡΑΦΗ ΧΡΗΣΤΗ
router.post('/signup', express.urlencoded({ extended: true }), async (req, res) => {
    const { name, lastname, email, phone, password } = req.body;
    let user = await getUsers(email)


    if (typeof user != "undefined") {

        return res.json({ status: 'emailExists' });
    }
    const hashpass = await bcrypt.hash(password, 10) //Κάνουμε hash τον κωδικό που όρισε ο χρήστης

    const bool = await insertUser(email, hashpass, name, lastname, phone); // Καταχωρούμε νέο χρήστη στη βάση με την συνάρτηση insertUser
    if (bool == 'ok') {  //έλεγχος οτι ήταν επιτυχής η εισαγωγή
        req.session.email = email;
        return res.json({ status: 'success' });
    }
    else {
        return res.json({ status: 'error' })
    }


});


router.get('/signup-html', async (req, res) =>{
    let url = 'signup';
    let authUrl = 'userHome';
    let mystyle;
    await authenticateUser(req.session.email, url, authUrl, (page) => {
        if (page == url) {
            mystyle = 'main_website/css/signup-css.css';
        }
        else {
            mystyle = 'user/css/user-home-css.css';
        }
        res.render(page, {
            style: mystyle
        });
      
    });
});


//ΕΓΓΡΑΦΗ ΧΡΗΣΤΗ-EMAIL CONFIRMATION
router.post('/confirmation', express.urlencoded({ extended: true }), async (req, res) => { //εφόσον η εγγραφή καταχωρηθεί το δεύτερο fetch στέλνει ένα αίτημα εδώ
    const { email } = req.body;
    let user = await getUsers(email); 
    //Κάνουμε sign το user id ώστε όταν επιστρέψει μέσω του link ο χρήστης να κάνουμε verify για να ελέγξουμε εάν έχει πειραχτεί το token και 
    //έτσι να σιγουρευτούμε πως ο valid χρήστης  επιστρέφει στην ιστοσελίδα
    jwt.sign(  
        {
            user: user.id_melous,
        },
        process.env.TOKEN_SECRET,
        {
            expiresIn: '1d',
        },
        (err, emailToken) => {
            const url = `http://localhost:3000/confirmation/${emailToken}`;

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.email,
                    pass: process.env.password //Κάνω store τα gmail credentials σε ένα .env αρχείο για ασφάλεια
                }
            })


            const mailOptions = {
                from: 'k1danaos.gym@gmail.com',
                to: req.body.email,
                subject: "Επιβεβαίωση email",
                html: `Παρακαλούμε πατήστε πάνω στον σύνδεσμο για να επιβεβαιώσετε το email σας: <a href="${url}">${url}</a>`
            }


            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    res.json({ status: 'error' });
                    console.log("Network error." + info)
                }
                else {
                    console.log('Email sent:' + info.response)
                    res.json({ status: 'success' });
                }
            }
            )
        },
    );
})

router.get('/confirmation/:token', async (req, res) => { //επιστροφή στην ιστοσελίδα απο το λινκ που στάλθηκε στο email του χρήστη
    try {
        const { user } = jwt.verify(req.params.token, process.env.TOKEN_SECRET);

        await getVerification(user); // θέτει το isconfirmed του χρήστη στη βάση =true
        let result = await getEmail(user);

        if (result) {
            req.session.email = result
            res.redirect('/')

        } else {
            res.send("Token was not verified");

        }
    } catch (e) {
        res.send('Account is not activated');
    }

});


router.get('/waitingVer', async (req, res) => {

    let email = req.session.email;
    if (email != undefined) {
        req.session.destroy((err) => {
            res.render("waitingForVer", {
                style: 'main_website/css/waitingForVer.css',
                email: email
            })

        })
    } else {
        res.render("home", {
            style: 'main_website/css/home-css.css'
        })
    }

});



//GOALS
router.get('/user-goals-html', async (req, res) => {
    let url = 'userGoals';
    let authUrl = 'authuserGoals';
    console.log(req.session.email)
    await authenticateUser(req.session.email, url, authUrl, async (page) => {
        if (page == url) {
            res.render('home', {
                style: 'main_website/css/home-css.css'
            })
        } else {
            let user = await getUsers(req.session.email);
            if (typeof user != undefined) {
                //χρησιμοποιούμε moment js για να βρούμε την αρχή και το τέλος την εβδομάδας και κάνουμε τα query στην βάση
                var beginOfWeek = moment().startOf('week').format("YYYY-MM-DD");
                var endOfWeek = moment().endOf('week').format("YYYY-MM-DD");
                const count = await getWorkoutsOfWeek(req.session.email, beginOfWeek, endOfWeek)
                const varos = await getVaros(user.id_melous);

                res.render(url, { //Εάν ο χρήστης έχει ήδη καταγεγραμμένες πληροφορίες για ύψος , κιλά και τους δύο στόχους τα εμφανίζουμε δυναμικά μέσω hbs 
                    style: 'user/css/user-goals-css.css',
                    layout: 'user-layout',
                    varos: varos == undefined ? null : varos.kila,
                    ipsos: user.ipsos,
                    kgGoals: user.varos_stoxos,
                    workoutGoals: user.workout_stoxos,
                    count: count[1] != null ? count[1] - count[0] : null
                })
            }
        }
    });

})


//GOALS-Ημερολόγιο 
router.get('/getworkout', express.urlencoded({ extended: true }), async (req, res) => {
    let workouts = await getWorkouts(req.session.email); //Η συνάρτηση getWorkouts επιστρέφει τα καταχωρημένα workouts του χρήστη ώστε να φορτωθούν στο ημερολόγιο
    res.json(workouts);
});

//GOALS-Ημερολόγιο 
router.post('/addWorkout', express.urlencoded({ extended: true }), async (req, res) => {//Καλώ μια συνάντηση που κάνει insert την date workout 
    const { date } = req.body
    await insertWorkout(date, req.session.email)
    res.send('ok');


});

//GOALS-Ημερολόγιο 
router.post('/RemoveWorkout', express.urlencoded({ extended: true }), async (req, res) => {//Καλώ μια συνάντηση που κάνει delete την date workout
    const { date } = req.body
    await RemoveWorkout(date, req.session.email)
    res.send('ok');


});

//GOALS-Update personal data χρήστη
router.post('/personalData', express.urlencoded({ extended: true }), async (req, res) => {
    const { ipsos, varos } = req.body;
    var now = moment().format("YYYY-MM-DD");

    await insertPersonalData(varos, ipsos, req.session.email, now);

    return res.json('ok');

});

//GOALS-Για το chart
router.get('/getVarosProgress', async (req, res) => {
    let start = moment().subtract(1, 'months').format('YYYY-MM-DD'); //Ένας μήνας πίσω
    let end = moment().format('YYYY-MM-DD');

    let varosProg = await getVarosProgress(req.session.email, start, end);
    res.json(varosProg);

});

//GOALS-Update στόχους κιλών και workout
router.post('/workouts', express.urlencoded({ extended: true }), async (req, res) => {
    const { kg_goals, workouts_goals } = req.body;

    await insertGoalsData(kg_goals, workouts_goals, req.session.email);

    return res.json('ok');

});


//EDIT
router.get('/editProfile', async (req, res) => {
    let url = 'home';
    let authUrl = 'edit';
    let mystyle;
    await authenticateUser(req.session.email, url, authUrl, async (page) => {
        if (page == url) {
            mystyle = 'main_website/css/home-css.css';
            res.render(page, {
                style: mystyle
            });
        }
        else {
            let user = await getUsers(req.session.email);
            if (typeof user != undefined) {
                if (user.isadmin) {

                    res.render(page, {
                        style: 'user/css/user-edit-css.css',
                        layout: 'admin-layout'

                    });
                } else {



                    res.render(page, {
                        style: 'user/css/user-edit-css.css',
                        layout: 'user-layout'
                    });
                }
            }
        }
    });
});

router.post('/changePersonalData', express.urlencoded({ extended: true }), async (req, res) => {
    const { email, phone, password } = req.body;
  
    let user = await getUsers(email)


    if (typeof user != "undefined") {

        return res.json({ status: 'emailExists' });
    }
    let me = await getUsers(req.session.email)
    const isMatch = await bcrypt.compare(password, me.kwdikos)


    if (!isMatch) {
        return res.json({ status: 'wrongPassword' });
    }

    const bool = await updateProfile(req.session.email, email, phone);
    if (bool == 'email') {

        req.session.email = email;

        res.json({ status: "success" })

    }
    else if (bool == "ok") {
        res.json({ status: "ok" })
    }
    else {
        return res.json({ status: 'error' })
    }


});


router.post('/changePassword', express.urlencoded({ extended: true }), async (req, res) => {
    const { passwordRepeat, passwordnew, password } = req.body;



    let me = await getUsers(req.session.email)
    const isMatch = await bcrypt.compare(password, me.kwdikos) //ελέγχουμε εάν ο χρήστης εισήγαγε σωστά τον παλιό κωδικό


    if (!isMatch) {
        return res.json({ status: 'wrongPassword' }); 
    }
    const hashpass = await bcrypt.hash(passwordnew, 10)

    const bool = await updatePassword(req.session.email, hashpass); // κάνουμε Hash τον νέο κωδικό και τον περνάμε στη βάση
    if (bool == 'ok') {

        res.json({ status: "success" })

    }
    else {
        return res.json({ status: 'error' })
    }


});




//ADMIN STATS
router.get('/statistics', async (req, res) => {
    let url = 'adminStats';
    let authUrl = 'authadminStats';
    await authenticateUser(req.session.email, url, authUrl, async (page) => {
        if (page == url) {
            res.render('home', {
                style: 'main_website/css/home-css.css'
            })
        } else {
            let user = await getUsers(req.session.email);

            if (typeof user != undefined) {
                if (user.isadmin) {
                    let statistics = await getStatistics(); 
                    //Φέρνουμε τα στατιστικά που χρειαζόμαστε για την σελίδα adminStats απο την βάση

                    res.render('adminStats', {
                        style: 'admin/css/adminStats.css',
                        layout: 'admin-layout',
                        totalUsers: statistics[0].count,
                        monthlyNewUsers: statistics[1].count,
                        nonActiveSub: statistics[2].count,
                        neverSub: statistics[3].count,
                        popularSub: statistics[4],
                        secPopularSub: statistics[5],
                        activeSubs: statistics[6].count,
                        monthlyNewSubs: statistics[7].count,
                        monthlyPopularSub: statistics[8]

                    });
                }

            }
        }
    });

})

router.get('/adminstats', async (req, res) => {

    let array = new Array();
    let array2 = new Array();
    let stats = await getAdminCharts(); //Συνάρτηση που επιστρέφει τα δεδομένα για τα δύο charts στη σελίδα στατιστικών του admin
    for (let i = 0; i < stats[0].rowCount; i++) {
        let string = JSON.stringify(stats[0].rows[i].monthlysyndromes);

        array.push([moment(string.substring(0, string.lastIndexOf("T"))).format('MMMM'), stats[0].rows[i].count])
    }

    for (let i = 0; i < stats[1].rowCount; i++) {
        let string = JSON.stringify(stats[1].rows[i].monthlysubs);

        array2.push([moment(string.substring(0, string.lastIndexOf("T"))).format('MMMM'), stats[1].rows[i].count])
    }

    res.json({
        data: array,
        eggrafes: array2
    })

});



//FOOTER LINKS
router.get('/payInfo', async (req, res) => {
    let url = 'payInfo';
    let authUrl = 'authpayInfo';
    await authenticateUser(req.session.email, url, authUrl, (page) => {
        if (page == url) {
            res.render(url, {
                style: 'main_website/css/payInfo-css.css'
            })
        } else {
            res.render(url, {
                style: 'main_website/css/payInfo-css.css',
                layout: 'user-layout'
            })
        }
    });

});

router.get('/privacyPolicy', async (req, res) => {
    let url = 'privacyPolicy';
    let authUrl = 'authprivacyPolicy';
    await authenticateUser(req.session.email, url, authUrl, (page) => {
        if (page == url) {
            res.render(url, {
                style: 'main_website/css/privacy-policy-css.css'
            })
        } else {
            res.render(url, {
                style: 'main_website/css/privacy-policy-css.css',
                layout: 'user-layout'
            })
        }
    });

});


module.exports = router;