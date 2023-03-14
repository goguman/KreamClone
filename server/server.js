require("dotenv").config({path: "../.env"}); // dotenv 패키지 설치 후 .env 파일 경로 설정(.env 인식)

const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser"); // 요청정보 처리
const cors = require("cors"); // 교차 출처 리소스 공유(Cross-Origin Resource Sharing, CORS)

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true })); // 객체 형식 처리
app.set('port', PORT);

let corsOptions = {
    origin: "*", // 출처 허용 옵션
    credential: true, // 사용자 인증이 필요한 리소스(쿠키, ...등) 접근
};

app.use(cors(corsOptions)); // 미들웨어 설정 작업

console.log("dbname");
console.log(process.env.DB_DBNAME);

const db = mysql.createPool({
    host: process.env.DB_HOSTNAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DBNAME,
    multipleStatements: true
});

app.listen(PORT, () => {
    console.log(`Server run : http://localhost:${PORT}/`)
});

app.get('/getProductList', (req, res) => {
    console.log("@@@");
    console.log("req.query >> ");
    console.log(req.query);
    console.log(req.query["theme"]);
    console.log(req.queryKey);

    const theme = req.query["theme"];

    let sqlString;

    if(theme === "justDropped") {
        console.log("go justDropped!");
        sqlString =
            'SELECT ' +
            'J.MODEL_CODE, ' +
            'B.NAME_EN AS BRAND_NAME, ' +
            'J.MODEL_NAME, ' +
            'FORMAT(RELEASE_PRICE, 0) AS RELEASE_PRICE, ' +
            'J.THUMBNAIL_PATH ' +
            'FROM JUST_DROPPED J, BRAND B ' +
            'WHERE J.BRAND_CODE = B.BRAND_CODE';
    } else if(theme === "newIn") {
        console.log("go newIn!");
        sqlString =
            'SELECT ' +
            'N.MODEL_CODE, ' +
            'B.NAME_EN AS BRAND_NAME, ' +
            'N.MODEL_NAME, ' +
            'FORMAT(RELEASE_PRICE, 0) AS RELEASE_PRICE, ' +
            'N.THUMBNAIL_PATH ' +
            'FROM NEW_IN N, BRAND B ' +
            'WHERE N.BRAND_CODE = B.BRAND_CODE';
    }
    db.query(sqlString, (error, rows) => {
        if(error) throw error;
        // console.log('Products List is : ', rows);
        res.send(rows);
    });
});

app.get('/getTopShortcutList', (req, res) => {
    const sqlString =
        'SELECT ' +
        'TITLE, ' +
        'THUMBNAIL_PATH, ' +
        'DIRECTION_URL ' +
        'FROM MAIN_TOP_SHORTCUT';
    db.query(sqlString, (error, rows) => {
        if(error) throw error;
        // console.log('shortcut List is : ', rows);
        res.send(rows);
    })
});

app.get('/getBrandFocusList', (req, res) => {
    const sqlString =
        'SELECT ' +
        'BRAND_CODE, ' +
        'NAME_KR AS TITLE, ' +
        'THUMBNAIL_PATH, ' +
        'BACKGROUND_COLOR ' +
        'FROM BRAND ' +
        'ORDER BY BRAND_CODE ASC ' +
        'LIMIT 15';
    db.query(sqlString, (error, rows) => {
        if(error) throw error;
        // console.log('BRAND FOCUS LIST is : ', rows);
        res.send(rows);
    })
});

app.get('/register', (req, res) => {
    const {email} = req.query;
    const sqlString = `SELECT email FROM User WHERE email='${email}'`;
    db.query(sqlString, (error, rows) => {
        if(error) throw error;
        console.log('userEmail List is : ', rows);
        res.send(rows);
    })
});

app.post('/signUp', async (req, res)=> {
    const { email, password, size } = req.body;
    const sqlString = `INSERT INTO User(id, email, password, size, email_receive, message_receive) VALUES('${email}','${email}', '${password}', '${size}', '${email_receive}', '${message_receive}')`;
    db.query(sqlString, (error, rows) =>{
        if(error) throw error;
        console.log('회원가입 성공');
    })
});

app.get('/myPage/sellAccount', async (req, res) => {
    const sqlString = 'SELECT * FROM BANK';
    db.query(sqlString, (error, rows) => {
        if(error) throw error;
        res.send(rows);
        console.log('조회 성공');
    })
});

app.get('/myPage/searchAccount', async (req, res) => {
    const { userId } = req.query;
    const sqlString = `SELECT * FROM USER_PAY_INFO WHERE USER_ID = '${userId}'`;
    db.query(sqlString, (error, rows) => {
        if(error) throw error;
        res.send(rows);
    })
})

app.post('/myPage/updateAccount', async (req, res) => {
    const { user_id, bank, accountNumber, userName } = req.body.params;
    const sqlString = `UPDATE  USER_PAY_INFO SET USER_BANK ='${bank}', ACCOUNT_NUMBER = '${accountNumber}', USER_NAME = '${userName}' WHERE USER_ID = '${user_id}'`;
    db.query(sqlString, (error, rows) => {
        if(error) throw error;
        res.send('ok');
    })
});

app.post('/myPage/insertAccount', async (req, res) => {
    const { user_id, bank, accountNumber, userName } = req.body.params;
    const sqlString = `INSERT INTO USER_PAY_INFO(USER_ID, USER_BANK, ACCOUNT_NUMBER, USER_NAME) VALUES ('${user_id}','${bank}','${accountNumber}','${userName}')`;
    db.query(sqlString, (error, rows) => {
        if(error) throw error;
        res.send('ok');
    })
});

app.post('/myPage/addAddress', async (req, res) => {
    const { user_id, name, phone, address1, postCode, detail, check } = req.body.params;

    if(check === 'Y') {
        const sqlString = 'UPDATE ADDRESS_INFO SET DEFAULT_YN = ? WHERE USER_ID = ?;'
        let data1 = ['N', user_id];
        let query1 = mysql.format(sqlString, data1);
        const sqlString2 = `INSERT INTO ADDRESS_INFO(USER_ID, NAME, PHONE, ADDRESS1, POSTCODE, ADDRESS2, DEFAULT_YN ) VALUES (?,?,?,?,?,?,?);`;
        let data2 = [user_id, name, phone, address1, postCode, detail, check];
        let query2 = mysql.format(sqlString2, data2);
        db.query(query1 + query2, (error, rows)=>{
            if(error) throw error;
            res.send('ok');
        });
    }else {
        const sqlString = `INSERT INTO ADDRESS_INFO(USER_ID, NAME, PHONE, ADDRESS1, POSTCODE, ADDRESS2, DEFAULT_YN ) VALUES ('${user_id}','${name}','${phone}','${address1}','${postCode}','${detail}','${check}')`;
        db.query(sqlString, (error, rows) => {
            if(error) throw error;
            res.send('ok');
        })
    }

});
app.post('/myPage/defaultAddress', async (req, res) => {
    const { user_id, address_id } = req.body.params;

    const sqlString = 'UPDATE ADDRESS_INFO SET DEFAULT_YN = ? WHERE ADDRESS_ID != ? AND USER_ID = ?;'
    let data1 = ['N', address_id, user_id];
    let query1 = mysql.format(sqlString, data1);
    const sqlString2 = 'UPDATE ADDRESS_INFO SET DEFAULT_YN = ? WHERE ADDRESS_ID = ? AND USER_ID = ?;'
    let data2 = ['Y', address_id, user_id];
    let query2 = mysql.format(sqlString2, data2);

    db.query(query1 + query2, (error, rows) => {
        if (error) throw error;
        res.send('ok');
    })
});

app.post('/myPage/removeAddr', async (req, res) => {
    const { user_id, address_id } = req.body.params;

    const sqlString = `DELETE FROM ADDRESS_INFO WHERE USER_ID = ? AND ADDRESS_ID = ?`;
    let data1 = [user_id, address_id];

    const query = mysql.format(sqlString, data1);
    db.query(query, (error, rows) => {
        if(error) throw error;
        res.send('ok');
    })
});
app.post('/myPage/cashReceiptAdd', async (req, res) => {
    const {user_id, type, addNumber } = req.body.params;

    const sqlString = `UPDATE  USER_PAY_INFO SET CASHTYPE =?, NUMBERS =? WHERE USER_ID = ?`;
    let data1 = [type, addNumber, user_id];

    const query = mysql.format(sqlString, data1);
    db.query(query, (error, rows) => {
        if(error) throw error;
        res.send('ok');
    })
});



app.post('/myPage/editAddress', async (req, res) => {
    const { user_id, name, phone, address1, postCode, detail, check, address_id } = req.body.params;

    const sqlString = 'UPDATE ADDRESS_INFO SET DEFAULT_YN = ? WHERE ADDRESS_ID != ? AND USER_ID = ?;'
    let data1 = ['N', address_id, user_id];
    let query1 = mysql.format(sqlString, data1);
    const sqlString2 = 'UPDATE ADDRESS_INFO SET DEFAULT_YN = ? WHERE ADDRESS_ID = ? AND USER_ID = ?;'
    let data2 = ['Y', address_id, user_id];
    let query2 = mysql.format(sqlString2, data2);
    const sqlString3 = 'UPDATE ADDRESS_INFO SET NAME = ?, ADDRESS1 = ?, POSTCODE = ?, ADDRESS2 = ?, PHONE = ? WHERE ADDRESS_ID = ?;'
    let data3 = [name, address1, postCode, detail, phone, address_id];
    let query3 = mysql.format(sqlString3, data3);

    db.query(query1 + query2 + query3, (error, rows) => {
        if (error) throw error;
        res.send('ok');
    })
});


app.post('/myPage/getAddress', async (req, res) => {
    const { user_id } = req.body.params;
    const sqlString = `SELECT * FROM ADDRESS_INFO WHERE USER_ID = '${user_id}'`;
    db.query(sqlString, (error, rows) => {
        if(error) throw error;
        console.log(rows);

        for(let i=0; i<rows.length; i++){
            let sctN = "*".repeat(rows[i].NAME.length-1);
            let secretName = rows[i].NAME.slice(0,1) + sctN;
            let phone = rows[i].PHONE.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
            console.log(phone);
            if(rows[i].PHONE.length === 11){
                rows[i].PHONE = phone.slice(0,4) + phone.slice(4,5) + "***"+ phone.slice(8,9) + "*" + phone.slice(-3);
            }
            if(rows[i].PHONE.length === 10) {
                rows[i].PHONE = phone.slice(0,4) + phone.slice(4,5) + "**"+ phone.slice(7,8) + "*" + phone.slice(-3);
            }
            rows[i].NAME = secretName;
        }
        res.send(rows);
    })
})
