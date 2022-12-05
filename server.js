const mysql = require('mysql');
const express = require('express');
const app = express();
app.use(express.json())
const PORT = 9999;
mysqlconnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'koraDB',
    multipleStatements: true
});
mysqlconnection.connect( ()=>{
    console.log('DATABASE IS CONNECTED SUCCESSFULLY')
})
app.get('/',(req,res)=>{
    res.send('welcome to the server')
});
app.get('/student',(req,res)=>{
    mysqlconnection.query(`SELECT * FROM studentDetails`,(err,rows,fields)=>{
        if(!err){
            res.status(200).json({
                message: 'created new record',
                data: rows
            })
        }else{
            res.status(404).json({
                message: err.message
            })
        }
    });
    app.get('/student/:id',(req,res)=>{
        let id = req.params.id;
        mysqlconnection.query(`SELECT * FROM studentDetails WHERE id =${id}`,(err,rows,fields)=>{
            if(err){
                res.status(404).json({
                    message: err.message
                })
            }else{
                res.status(200).json({
                    message: 'student was successfully retrieved',
                    data: rows
                })
            }
        })
    });
    app.delete('/student/:id',(req,res)=>{
        let id = req.params.id
        mysqlconnection.query(`DELETE FROM studentDetails WHERE id =${id}`,(err,rows,fields)=>{
            if(err){
                res.status(404).json({
                    message: err.message
                })
            }else{
                res.status(200).json({
                    message: 'successfully deleted a record from our data',
                    data: rows
                })
            }
        })
    });
    app.post('/student',(req,res)=>{
        let body = req.body;
        let sql = `SET @id=?; SET @name=?; SET @course=?; SET @duration=?; SET @age=?;
        CALL curveAddOrEdit(@id, @name, @course, @duration, @age);`;
        mysqlconnection.query(sql,[body.id, body.name, body.course, body.duration, body.age],(err,rows,fields)=>{
        if(!err){
            rows.forEach( (item)=>{
                if(item.constructor == Array){
                    res.status(200).json({
                        message: 'A new record was created',
                        data: 'student id:' + item[0].id
                    })
                }else{
                    console.log('ERROR OOOOOO')
                }
            })
        }else{
            res.status(404)({
                message: err.message
            })
        }
    })
});
app.put('/student',(req,res)=>{
    let body = req.body;
    let sql = `SET @id=?; SET @name=?; SET @course=?; SET @duration=?; SET @age=?;
    CALL curveAddOrEdit(@id, @name, @course, @duration, @age);`;
    mysqlconnection.query(sql,[body.id, body.name, body.duration,body.course, body.age],(err,rows,fields)=>{
        if(!err){
            res.status(200).json({
                message: 'student was successfully updated',
                data: rows
            })
        }else{
            res.status(404).json({
                message: err.message
            })
            console.log(err.message)
        }
    })
})
})
app.listen(PORT,()=>{
    console.log(`server is listening to port: ${PORT}`)
})