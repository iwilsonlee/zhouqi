var mysql = require('./db');

function Member(member) {
    this.id = member.id;
    this.user_code = member.user_code;
    this.password = member.password;
    this.email = member.email;
    this.name = member.name;
    this.first_name = member.first_name;
    this.nickname = member.nickname;
    this.mobile = member.mobile;
    this.company_code = member.company_code;
    this.recommend_no = member.recommend_no;
    this.create_time = member.create_time;
    this.login_time = member.login_time;
    this.login_ip = member.login_ip
};

module.exports = Member;

function GetRandomNum(Min,Max)
{
    var Range = Max - Min;
    var Rand = Math.random();
    return(Min + Math.round(Rand * Range));
}

function check(err, member,uc, callback){
    if(err) throw err;
    if(!member){
        callback(uc);
    }else{
        uc = GetRandomNum(100,100000000);
        Member.get1(uc,check, callback);
    }
}

Member.get_user_code = function (callback){
    var uc = GetRandomNum(100,100000000);
    Member.get1(uc, check, callback);

};

Member.get1 = function (user_code, callback, callback2){
    //var connection =  mysql.connection;
    mysql.connection(function(connection){
        connection.query(
            'SELECT * FROM members where user_code = ?', user_code,
            function selectCb(err, results, fields) {
                if (err) {
                    throw err;
                }
                connection.end();
                var member = null;
                if(results && results.length > 0){
                    member = new Member(results[0]);
                }
                callback(err,member, user_code,callback2);
            }
        );
    });
};


Member.get = function (user_code, callback){
    //var connection =  mysql.connection;
    mysql.connection(function(connection){
        connection.query(
            'SELECT * FROM members where user_code = ?', user_code,
            function selectCb(err, results, fields) {
                if (err) {
                    throw err;
                }
                connection.end();
                var member = null;
                if(results && results.length > 0){
                   member = new Member(results[0]);
                }
                callback(err,member, fields);
            }
        );
    });
};


Member.save = function (member, callback){
    //var connection =  mysql.connection;
    if(member.id){
        mysql.connection(function(connection){
            connection.query(
                'UPDATE members SET ? where id='+member.id,member,function(err,results,fields){
                    if(err) throw err;
                    connection.end;
                    if(results && results.changedRows > 0){
                        callback(err,member, fields);
                    }else{
                        throw new Error("update failed!");
                    }

                }
            );
        })
    }else{
        mysql.connection(function(connection){
            connection.query(
                'INSERT INTO members SET ?', member,
                function selectCb(err, results, fields) {
                    if (err) {
                        throw err;
                    }
                    connection.end();
                    if(results && results.insertId > 0){
                        member.id = results.insertId;
                    }
                    callback(err,member, fields);
                }
            );
        });
    }

};




