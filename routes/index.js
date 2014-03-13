
/*
 * GET home page.
 */
var crypto = require('crypto');
var Member = require('../modules/member');

exports.home_do = function(req, res){
    var recommendNo = req.body.recommendNo;
    console.log("recommendNo : " + recommendNo);
    Member.get(recommendNo,function(err, member,fields){
        if(err){
            res.send('Error:503, Query Error!');
        }
        if(!member){
            res.send('此销售顾问编号不存在。');
        }else{
            req.session.user_code = member.user_code;
            req.session.name = member.name;
            // req.flash('success', 'Successful!');
            res.send('ok');
        }


    });
}

exports.home = function(req, res){
    var recommendNo = req.params.recommendNo;
    if(recommendNo){
        if(!req.session.user_code || !req.session.name){
            Member.get(recommendNo, function(err, member, fields){
                if(err){
                    res.send('Error:503, Query Error!');
                }
                if(member){
                    res.render('home', { user_code: recommendNo, member_name:member.name });
                }else{
                    req.session.error = "此销售顾问编号不存在！";
                    res.redirect("/error");
                }
            });
        }else{
            res.render('home', { user_code: req.session.user_code, member_name:req.session.name });
        }
    }else{
        req.session.error = "此销售顾问编号不存在！";
        res.redirect("/error");
    }



}

exports.register = function(req, res){
    var recommendNo = req.params.recommendNo;
    Member.get(recommendNo, function(err, member, fields){
        if(err){
            res.send('Error:503, Query Error!');
        }
        if(member){
            res.render('register', { user_code: recommendNo, member_name:member.name });
        }else{
            req.session.error = "此销售顾问编号不存在！";
            res.redirect("/error");
        }
    });

}

function GetRandomNum(Min,Max)
{
    var Range = Max - Min;
    var Rand = Math.random();
    return(Min + Math.round(Rand * Range));
}

function getClientIp(req) {
    return req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
};

exports.register_do = function(req, res){
    if(!req.body.lastName || req.body.lastName==='请输入您的名字'){
       res.send("请输入您的名字");
    }
    else if(!req.body.firstName || req.body.firstName==='请输入您的姓氏'){
        res.send("请输入您的姓氏");
    }
    else if(!req.body.nickname || req.body.nickname==='请输入您的昵称'){
        res.send("请输入昵称");
    }
    else if(!req.body.mobile || req.body.mobile==='请输入您的手机号码'){
        res.send("请输入手机号");
    }
    else if(!req.body.email || req.body.email==='请输入您的电子邮箱'){
        res.send("请输入Email");
    }
    else if(!req.body.confirmEmail || req.body.confirmEmail==='请确认您的电子邮箱'){
        res.send("请确认您的电子邮箱");
    }
    else if( req.body.email != req.body.confirmEmail){
        res.send("您两次输入的邮箱不正确，请确认您的电子邮箱！");
    }
    else if(!req.body.companyCode){
        res.send("请输入国家/地区");
    }
    else if(!req.body.agreement){
        res.send("必须阅读并同意我们的会员协议才能注册为会员");
    }
    else if(!req.body.recommend_no){
        res.send("缺少销售顾问编号");
    }
    else{
        var newMember = new Member({id:null,
            user_code:null,
            password:crypto.createHash('md5').update(req.body.email).digest('hex'),
            email:req.body.email,
            name:req.body.lastName,
            first_name:req.body.firstName,
            nickname:req.body.nickname,
            mobile:req.body.mobile,
            company_code:req.body.companyCode,
            recommend_no:req.body.recommend_no,
            create_time: new Date(),
            login_time: new Date(),
            login_ip:getClientIp(req)
        });

        //var oldMember = new Member({user_code:null});
        Member.get_user_code(function(uc){
            if(uc){
                newMember.user_code = uc;
                Member.save(newMember, function(err, member, fields){
                    if(err){
                        res.send('Error:503, Query Error!');
                    }
                    if(member && member.id){
                        req.session.member = member;
                        res.send("ok#"+member.user_code+"#"+member.email);
                    }else{
                        res.send("注册失败！");
                    }
                });
            }else{
                res.send("user_code重复！");
            }

        })

    }

}

exports.helpEmail = function(req, res){
    res.render('helpEmail', { title: 'Express' });
}
exports.index = function(req, res){
  res.redirect('/member/login');
};

exports.member_index = function(req, res){
    var p = (require('url')).parse(req.url);
    var myUrl = "http://"+p.hostname+"/"+req.session.member.user_code;


    res.render('member/index', { title: 'Express', myUrl:myUrl });
};

exports.barcode = function(req, res){
    if(req.session.member){
        var data = "http://localhost/"+req.session.member.user_code;
        var iconv = require('../modules/qrcode/iconv.js');
        var qrcode = require('../modules/qrcode/qrcode.js');
        var qr = qrcode.qrcode(4, 'M');
        qr.addData(data);  // 解决中文乱码
        qr.make();

        var base64 = qr.createImgTag(5, 10);  // 获取base64编码图片字符串
        base64 = base64.match(/src="([^"]*)"/)[1];  // 获取图片src数据

        base64 = base64.replace(/^data:image\/\w+;base64,/, '');  // 获取base64编码
        base64 = new Buffer(base64, 'base64');  // 新建base64图片缓存

        res.writeHead(200, {'Content-Type': 'image/gif', 'Content-Disposition': 'attachment; filename=' + 'qrcode.gif'});  // 设置http头
        res.write(base64);  // 输出图片
        res.end();
    }else{
        res.send("Error");
    }


}

exports.member_login = function(req, res){

    res.render('member/login', { title: 'Express' });
};

exports.member_doLogin = function(req, res){
    var password_md5 = crypto.createHash('md5').update(req.body.password).digest('hex');
    Member.get(req.body.userCode,function(err, member,fields){
        if(err){
            res.send('Error:503, Query Error!');
        }
        if(!member){
            res.send('此会员不存在。');
        }
        var passwd = member.password;
        if(passwd != password_md5){
            res.send('密码错误！');
        }else{
            member.login_time = new Date();
            member.login_ip = getClientIp(req);
            Member.save(member, function(err, member, fields){
                if(err){
                    res.send('Error:503, Query Error!');
                }
                if(member && member.id){
                    req.session.member = member;
                    res.send("ok");
                }else{
                    res.send("登录失败");
                }
            });
        }


    });

};

exports.member_logout = function(req, res){
    req.session.member = null;
    res.redirect('/')

}

exports.captcha = function(req, res){
    //var captcha = require('../modules/captcha');
    //captcha.createCaptcha(req, res);
}

exports.error = function(req, res){
    res.render("error", {user_code:req.session.user_code, member_name:req.session.name});
}