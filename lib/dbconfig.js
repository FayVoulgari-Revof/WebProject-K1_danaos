const { Pool } = require('pg');
const moment = require('moment');
require('dotenv').config();//To dotenv χρειάζεται για να βλέπω το .env αρχείο

// Φτιάχνουμε dev και prod envs για σύνδεση στη βάση τοπικά
/*const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});*/

//Σύνδεση με βάση Heroku
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});


//Επιλογή όλων των στοιχείων του μέλους
const getUsers = async (email) => {
  const client = await pool.connect();

  try {
    // επιστρέφω το μέλος
    const results = await client.query(`SELECT * FROM melos where email=$1`, [email]);

    return results.rows[0];
  } catch (e) {
    console.log(e);
    return false;

  } finally {

    client.release();
  }

}

//Συνάρτηση που επιστρέφει το email του χρήστη
const getEmail = async (id) => {
  const client = await pool.connect();

  try {
    // Κάνω ένα query και επιστρέφω το id του χρήστη


    const email = await client.query(`select email from melos  WHERE id_melous=$1`, [id]);

    return email.rows[0].email;

  }
  catch (e) {
    console.log(e);
    return false;

  } finally {

    client.release();
  }

}

//Συνάρτηση εισαγωγής νέου μέλους στη βάση
const insertUser = async (email, pass, name, lastname, phone) => {
  const client = await pool.connect();

  try {
    // Κάνω ένα query και εισάγω καινούργιο χρήστη στην βάση
    const results = await client.query(`INSERT INTO melos(onoma,epwnumo,thlefono,email,kwdikos,hmeromhnia_eggrafis) VALUES($1,$2,$3,$4,$5,$6)`, [name, lastname, phone, email, pass, moment().format('YYYY-MM-DD')]);
    return "ok";
  } catch (e) {
    console.log(e);
    return false;

  } finally {

    client.release();
  }

}



//Συνάρτηση ελέγχου εάν ο χρήστης είναι συνδεδεμένος ή οχι ώστε να μεταβαίνουμε στο σωστό url
async function authenticateUser(email, url, authUrl, callback) {
  let user = await getUsers(email);
  //Εάν βρεθεί ο χρήστης να πάμε στο authurl αλλιώς στο απλό url
  if (user) {
    callback(authUrl);
  }
  else callback(url);
}


//Συνάρτηση εισαγωγής σε υπάρχουσα εγγραφή μέλους των επιπλέον στοιχείων του χρήστη (Βάρος, ύψος)
const insertPersonalData = async (varos, ipsos, email, now) => {
  const client = await pool.connect();

  try {
    // Κάνω ένα query και επιστρέφω το id του χρήστη 

    const id = await client.query(`Select id_melous from melos where email=$1 `, [email])
    //Κάνω την εγγραφή για το βάρος 
    await client.query(`INSERT INTO varos(melos_id,kila,hmeromhnia_kataxwrisis) VALUES($1,$2,$3)`, [id.rows[0].id_melous, varos, now]);
    //Κάνω την εγγραφή για το ύψος 
    await client.query(`UPDATE melos SET ipsos=$1 WHERE email=$2`, [ipsos, email]);
    return "ok";
  } catch (e) {
    console.log(e);
    return false;

  } finally {

    client.release();
  }
}

//Συνάρτηση εισαγωγής σε υπάρχουσα εγγραφή μέλους των επιπλέον στοιχείων του χρήστη (Goals)
const insertGoalsData = async (kg_goals, workouts_goals, email) => {
  const client = await pool.connect();

  try {
    // Κάνω ένα query και εισάγω τους νέους στόχους του χρήστη
    await client.query(`UPDATE melos SET varos_stoxos=$1,workout_stoxos=$2 WHERE email=$3`, [kg_goals, workouts_goals, email]);
    return "ok";
  } catch (e) {
    console.log(e);
    return false;

  } finally {

    client.release();
  }
}

//Συνάρτηση που επιστρέφει τα καταχωρημένα workouts του χρήστη στο ημερολόγιο
const getWorkouts = async (email) => {
  const client = await pool.connect();

  try {
    // Κάνω ένα query και επιστρέφω τα εγγεγραμένα workouts του χρήστη
    const result = await client.query(`Select (hmeromhnia + interval '1 day') as day from workout INNER JOIN melos on melos.id_melous = workout.melos_id WHERE email=$1`, [email]);
    return result.rows;
  } catch (e) {
    console.log(e);
    return false;

  } finally {

    client.release();
  }
}

//Συνάρτηση που κάνει εισαγωγή νέου workout στη βάση
const insertWorkout = async (date, email) => {
  const client = await pool.connect();

  try {
    // Κάνω ένα query και επιστρέφω το id του χρήστη
    const id = await client.query(`Select id_melous from melos where email=$1 `, [email])
    //εισάγω το καινούργιο workout 
     await client.query(`Insert INTO workout(hmeromhnia,melos_id) VALUES ($1,$2) `, [date, id.rows[0].id_melous]);

    return true;
  } catch (e) {
    console.log(e);
    return false;

  } finally {

    client.release();
  }
}

//Συνάρτηση που διαγράφει ενα workout απο τη βάση
const RemoveWorkout = async (date, email) => {
  const client = await pool.connect();

  try {
    // Κάνω ένα query και διαγράφω το workout απο την βάση

    const result = await client.query(`DELETE from workout where hmeromhnia = $1 `, [date]);
    return true;
  } catch (e) {
    console.log(e);
    return false;

  } finally {

    client.release();
  }
}

//Συνάρτηση που επιστρέφει την τελευταία εγγραφή βάρους του χρήστη
const getVaros = async (id) => {
  const client = await pool.connect();

  try {
    // Κάνω ένα query και επιστρέφω την τελευταία εγγραφή βάρους που έχει κάνει ο χρήστης.Αυτο επιτυγχάνεται 
    //χρησιμοποιώντας ORDER BY hmeromhnia_kataxwrisis DESC και επιλέγοντας την πρώτη γραμμή απο τα αποτελέσματα 
    const result = await client.query(`Select kila,hmeromhnia_kataxwrisis from varos  WHERE melos_id=$1 ORDER BY hmeromhnia_kataxwrisis DESC`, [id]);
    return result.rows[0];
  } catch (e) {
    console.log(e);
    return false;

  } finally {

    client.release();
  }

}

//Συνάρτηση που επιστρέφει τις καταχωρήσεις βάρους του χρήστη τον τελευταίο μήνα
const getVarosProgress = async (email, start, end) => {
  const client = await pool.connect();

  try {
    // Κάνω ένα query και επιστρέφω το id του εγγραγραμμένου χρήστη
    const id = await client.query(`Select id_melous from melos where email=$1 `, [email])
    //Παίρνω τα κιλά του τελευταίου μήνα με το επόμενο query
    const result = await client.query(`Select kila,(hmeromhnia_kataxwrisis + interval '1 day') as day from varos  WHERE melos_id=$1 AND hmeromhnia_kataxwrisis BETWEEN $2 AND $3 ORDER BY hmeromhnia_kataxwrisis ASC`, [id.rows[0].id_melous, start, end]);

    return result.rows;
  } catch (e) {
    console.log(e);
    return false;

  } finally {

    client.release();
  }

}

//Συνάρτηση που επιστρέφει τον εβδομαδιαίο στόχο workouts του χρήστη καθώς και το σύνολο των logged workouts της εβδομάδας 
const getWorkoutsOfWeek = async (email, start, end) => {
  const client = await pool.connect();

  try {

    // Κάνω ένα query και επιστρέφω το id του εγγραγραμμένου χρήστη
    const stoxos = await client.query(`Select workout_stoxos  from melos where email=$1 `, [email]);
    //Κάνω ένα query και επιστρέφω τον αριθμό των εγγραφών που έγιναν την τελευταία βδομάδα 
    const result = await client.query(`Select COUNT(*)  from workout INNER JOIN melos on melos.id_melous = workout.melos_id WHERE email=$1 AND hmeromhnia BETWEEN $2 and $3`, [email, start, end]);

    return [result.rows[0].count, stoxos.rows[0].workout_stoxos];
  } catch (e) {
    console.log(e);
    return false;

  } finally {

    client.release();
  }
}

//Συνάρτηση που καταχωρεί πως ο χρήστης "παρακολουθεί" ένα πλάνο (πρόγραμμα), πως θέλει δηλαδή να το βλέπει στο πρόγραμμά του 
const insertPlano = async (plano, email) => {
  const client = await pool.connect();

  try {
    // Κάνω ένα query και επιστρέφω το id του εγγεγραμμένου χρήστη
    const id = await client.query(`Select id_melous from melos where email=$1 `, [email])

    //Επιστρέφω το id του πλάνου 
    const myplano = await client.query(`Select id_planou from PLANO_EKGYMNASIS where onoma=$1 `, [plano])
    //Χρησιμοποιώ τα id  του πλάνου και του χρήστη ώστε να κάνω νέα εγγραφή στον πίνακα Parakolouthei
    await client.query(`Insert INTO PARAKOLOUTHEI (melos ,plano ) VALUES ($1,$2) `, [id.rows[0].id_melous, myplano.rows[0].id_planou]);
    return true;
  } catch (e) {
    console.log(e);
    return false;

  } finally {
    client.release();
  }
}

//Συνάρτηση που καταχωρεί πως ο χρήστης ΔΕΝ "παρακολουθεί" πια ένα πλάνο (πρόγραμμα)
const deletePlano = async (plano, email) => {
  const client = await pool.connect();

  try {
    // Κάνω ένα query και επιστρέφω το id του εγγραγραμμένου χρήστη
    const id = await client.query(`Select id_melous from melos where email=$1 `, [email])

    //Επιστρέφω το id του πλάνου 
    const myplano = await client.query(`Select id_planou from PLANO_EKGYMNASIS where onoma=$1 `, [plano])
    //Διαγράφω την εγγραφή του χρήστη σε ένα πλάνο εγύμνασης
    const result = await client.query(`DELETE from  PARAKOLOUTHEI  where melos=$1 and plano=$2  `, [id.rows[0].id_melous, myplano.rows[0].id_planou]);
    return true;
  } catch (e) {
    console.log(e);
    return false;

  } finally {
    client.release();
  }
}

//Συνάρτηση που επιστρέφει όλα τα πλάνα που "παρακολουθεί" ο χρήστης
const getPlano = async (id,) => {
  const client = await pool.connect();

  try {
    //Επιστρέφω όλα τα πλάνα εκγύμνασης στα οποία συμετέχει ο χρήστης
    const result = await client.query(`Select onoma from parakolouthei INNER JOIN PLANO_EKGYMNASIS on parakolouthei.plano=PLANO_EKGYMNASIS.id_planou where melos=$1`, [id]);


    let array_json = {
      cross: false,
      bodypump: false,
      zumba: false,
      pilates: false,
      hipsabs: false,
      trx: false,
      kickKids: false,
      kickPro: false
    }
    for (let i = 0; i < result.rowCount; i++) {
      let temp = result.rows[i].onoma;
      array_json[temp] = true;
      //Θέτω true στα πλάνα στα οποία  ο χρήστης συμμετέχει
    }
    return array_json;
  } catch (e) {
    console.log(e);
    return false;

  } finally {

    client.release();
  }

}

//Συνάρτηση που κάνει update τα στοιχεία επικοινωνίας του χρήστη
const updateProfile = async (email, newEmail, phone) => {
  const client = await pool.connect();

  try {
    //Ελέγχω ποια πεδία έχουν συμπληρωθεί και έπειτα κάνω τα κατάλληλα updates
    if (phone != "" && newEmail != "") {

      await client.query(`UPDATE melos SET thlefono=$1,email=$2,isconfirmed=$4 WHERE email=$3`, [phone, newEmail, email,false]);
      return "email"

    } else if (phone != "") {
      await client.query(`UPDATE melos SET thlefono=$1 WHERE email=$2`, [phone, email]);
      return "ok";
    } else if(newEmail!=""){

      await client.query(`UPDATE melos SET email=$1,isconfirmed=$3 WHERE email=$2`, [newEmail, email,false]);
      return "email"

    }
    
    //Κάνω την εγγραφή για το ύψος 

  } catch (e) {
    console.log(e);
    return false;

  } finally {

    client.release();
  }
}

//Συνάρτηση που κάνει update τον κωδικό του χρήστη
const updatePassword = async (email, pass) => {
  const client = await pool.connect();

  try {
    // Κάνω ένα query και επιστρέφω το id του χρήστη 

    await client.query(`UPDATE melos SET kwdikos=$1 WHERE email=$2`, [pass, email]);
    return "ok"




  } catch (e) {
    console.log(e);
    return false;

  } finally {

    client.release();
  }
}






//Συνάρτηση που ελέγχει αν ο χρήστης isconfirmed , αν έχει δηλαδή κάνει activate το account του
const getVerification = async (id) => {
  const client = await pool.connect();

  try {
    // Κάνω ένα query και επιστρέφω το id του χρήστη


    await client.query(`UPDATE melos SET isconfirmed=$1 WHERE id_melous=$2`, [true, id]);
    return "ok";

  }
  catch (e) {
    console.log(e);
    return false;

  } finally {

    client.release();
  }

}

//Συνάρτηση που επιστρέφει όλους τους χρήστες(εκτός του admin) με τα στοιχεία που θέλουμε να προβάλουμε στο userList του admin
const getAllUsers = async () => {
  const client = await pool.connect();

  try {
    // Κάνω ένα query και επιστρέφω το id του χρήστη


    const results = await client.query(`select * from melos  WHERE isadmin=$1`, [false]);
    let result = [];
    for (let i = 0; i < results.rowCount; i++) {
      let data = {
        email: results.rows[i].email,
        onoma: results.rows[i].onoma,
        epwnumo: results.rows[i].epwnumo,
        phone: results.rows[i].thlefono,
      }
      result.push(data);
    }

    return result;

  }
  catch (e) {
    console.log(e);
    return false;

  } finally {

    client.release();
  }

}


//Συνάρτηση που επιστρέφει τα στοιχεία της συνδρομής 
const getTimi = async (id) => {
  const client = await pool.connect();

  try {

    const result = await client.query(`Select * from syndromi  WHERE code_syndromis=$1 `, [id]);
    return result.rows[0];
  } catch (e) {
    console.log(e);
    return false;

  } finally {

    client.release();
  }

}

//Συνάρτηση που εισάγει μια νέα συνδρομή στη βάση
const insertSyndromi = async (melos, currentdate, startdate, enddate, syndromi) => {
  const client = await pool.connect();

  try {
    const result = await client.query(`INSERT INTO AGORAZEI (syndromi,melos,hmeromhnia_agoras,hmeromhnia_enarksis,hmeromhnia_lhksis) VALUES ($1,$2,$3,$4,$5) 
     `, [syndromi, melos, currentdate, startdate, enddate]);

    return true;
  } catch (e) {
    console.log(e);
    return false;

  } finally {

    client.release();
  }



}

//Συνάρτηση που επιστρέφει τις ενεργές συνδρομές
const getSyndromi = async (email) => {
  const client = await pool.connect();

  try {
    const id = await client.query(`Select id_melous from melos where email=$1 `, [email])


    const result = await client.query(`Select * from agorazei where melos=$1`, [id.rows[0].id_melous]);

    console.log(result);

    let array_json = {
      YearlyOrgana: false,
      MonthlyOrgana: false,
      kickKids: false,
      kickPro: false
    }
    //Αν η ημερομηνια της συνδρομής είναι ενεργή τότε την θέτω ως true ώστε να τυπωθεί δυναμικά μέσω hbs το κατάλληλο μήνυμα
    for (let i = 0; i < result.rowCount; i++) {
      if (moment().isBetween(result.rows[i].hmeromhnia_enarksis, result.rows[i].hmeromhnia_lhksis)) {
        array_json[result.rows[i].syndromi] = true;


      }
    }


    return array_json;
  } catch (e) {
    console.log(e);
    return false;

  } finally {

    client.release();
  }


}
//Συνάρτηση που επιστρέφει τα σταστιστικά στοιχεία των χρηστών για την σελίδα admin stats
const getStatistics = async () => {
  const client = await pool.connect();

  try {
    const total_users = await client.query(`Select COUNT(*)  from melos WHERE isadmin=$1`, [false]);
    const total_users_month = await client.query(`Select COUNT(*) from melos  WHERE hmeromhnia_eggrafis BETWEEN $1 and $2 AND isadmin=$3 `, [moment().startOf('month').format('YYYY-MM-DD'), moment().endOf('month').format('YYYY-MM-DD'), false]);
    const neverSub = await client.query(`Select COUNT(*) from melos  WHERE melos.id_melous NOT IN (SELECT agorazei.melos FROM agorazei) AND isadmin=$1`, [false]);
    const noActiveSub = await client.query(`Select COUNT(*) from agorazei WHERE hmeromhnia_lhksis < $1  `, [moment().format('YYYY-MM-DD')]);
    const popularSub = await client.query(`Select COUNT(agorazei.syndromi) AS popsub, syndromi.onoma_syndromis from agorazei INNER JOIN syndromi ON syndromi.code_syndromis=agorazei.syndromi GROUP BY agorazei.syndromi,syndromi.onoma_syndromis ORDER BY popsub DESC `);
    const popularSubMonthly = await client.query(`Select COUNT(*) from agorazei  WHERE hmeromhnia_lhksis > $1 AND hmeromhnia_enarksis < $1  `, [moment().format('YYYY-MM-DD')]);
    const monthlyNewSubs = await client.query(`Select COUNT(*) from agorazei  WHERE hmeromhnia_agoras BETWEEN $1 and $2  `, [moment().startOf('month').format('YYYY-MM-DD'), moment().endOf('month').format('YYYY-MM-DD')]);
    const monthlyPopularSub = await client.query(`Select COUNT(agorazei.syndromi) AS monthlypopsub, syndromi.onoma_syndromis from agorazei INNER JOIN syndromi ON syndromi.code_syndromis=agorazei.syndromi WHERE hmeromhnia_agoras BETWEEN $1 and $2  GROUP BY agorazei.syndromi,syndromi.onoma_syndromis ORDER BY monthlypopsub DESC `, [moment().startOf('month').format('YYYY-MM-DD'), moment().endOf('month').format('YYYY-MM-DD')]);



    let data = { count: parseInt(noActiveSub.rows[0].count) + parseInt(neverSub.rows[0].count) } //χρήστες που δεν έχουν ενεργή συνδρομή + αυτοί που δεν αγόρασαν ποτέ συνδρομή=αυτοί που δεν έχουν ενεργή συνδρομή
    return [total_users.rows[0], total_users_month.rows[0], data, neverSub.rows[0], popularSub.rows[0], popularSub.rows[1], popularSubMonthly.rows[0], monthlyNewSubs.rows[0], monthlyPopularSub.rows[0]];
  } catch (e) {
    console.log(e);
    return false;

  } finally {

    client.release();
  }
}
//Συνάρτηση που επιστρέφει έναν πίνακα με όλες τις ενεργές συνδρομές του χρήστη για την Admin User List
const userSyndromes = async (userList) => {
  const client = await pool.connect();

  try {
    let array = new Array();
    for (let i = 0; i < userList.length; i++) {
      let userSub = new Array();
      const id = await client.query(`Select id_melous from melos where email=$1 `, [userList[i].email])

      let syndromes = await client.query(`Select * from agorazei INNER JOIN syndromi ON syndromi.code_syndromis=agorazei.syndromi where melos=$1`, [id.rows[0].id_melous])

      for (let j = 0; j < syndromes.rowCount; j++) {
        if (moment().isBetween(syndromes.rows[j].hmeromhnia_enarksis, syndromes.rows[j].hmeromhnia_lhksis)) {
          userSub.push(syndromes.rows[j].onoma_syndromis);

        }
      }
      array.push(userSub);

    }

    return array;
  } catch (e) {
    console.log(e);
    return false;

  } finally {

    client.release();
  }

}

//Συνάρτηση που επιστρέφει τα δεδομένα για τα δύο charts στη σελίδα στατιστικών του admin
const getAdminCharts = async () => {
  const client = await pool.connect();

  try {

    //Χωρίζω με την συνάρτηση DATE_TRUNC τις ημερομηνίες ανά μήνα .Το ASC είναι για να εμφανίζοντα οι μήνες με την σωστή σειρά στο chart
    let syndromes = await client.query(`Select  (DATE_TRUNC('month',hmeromhnia_agoras)+ interval '1 day') AS  Monthlysyndromes, COUNT(id_agoras) AS count from agorazei GROUP BY Monthlysyndromes ORDER BY Monthlysyndromes ASC `);


    let eggrafes = await client.query(`Select  (DATE_TRUNC('month',hmeromhnia_eggrafis)+ interval '1 day') AS  monthlySubs, COUNT(id_melous) AS count from melos GROUP BY monthlySubs ORDER BY monthlySubs ASC `);

    return [syndromes, eggrafes];
  } catch (e) {
    console.log(e);
    return false;

  } finally {

    client.release();
  }

}


module.exports = { pool, getStatistics, getAdminCharts, userSyndromes, getTimi, insertSyndromi, getSyndromi, getAllUsers, getEmail, getVerification, getPlano, updatePassword, insertPlano, deletePlano, getVarosProgress, getUsers, getVaros, updateProfile, insertUser, authenticateUser, insertPersonalData, insertGoalsData, getWorkouts, insertWorkout, RemoveWorkout, getWorkoutsOfWeek };