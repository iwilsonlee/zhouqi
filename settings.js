/**
 * mysql
 * 如果开启了mysql的auth,请更改user和password字段
 * if you enable mongodb auth, pls change user & password field
 */
var mysql = {
  database: 'zhouqi',
  host: '127.0.0.1',
  port: '3306',
  user: 'wenson',
  password: 'wenson'
}; 

/**
 * 站点配置
 */
var site = {
	author: "WilsonLee",
	title: "Zhouqi",
	subtitle: "@zhouqi",
	indexEmotionAmount: 5,
		//主页显示的Emotion数量,etc,0 == all
	indexPostAmount: 0,
	indexGalleryAmount: 3,
	indexLinkAmount: 21
};


module.exports = {
	mysql: mysql,
	site: site
}