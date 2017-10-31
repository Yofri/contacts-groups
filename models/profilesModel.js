const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('database.db');
const Contact = require('./contactsModel')
const Konjungsi = require('./contactGroup')


class Profile{

	static getAllProfile(){
		return new Promise((resolve, reject) => {
			db.all(`select * from Profile`, (err, profiles)=>{
				if(!err){
					resolve(profiles)
				}else{
					reject(err)
				}
			})
		});
	}

	static addProfile(data){
		return new Promise((resolve, reject) => {
			db.run(`insert into Profile (username, password, id_contact) values ("${data.username}", "${data.password}", "${data.contact}")`, err=>{
				if(err){
					reject(err);
				}else{
					resolve()
				}
			})	
		})
	}

	static getProfileById(data){

		return new Promise((resolve, reject) => {
			db.get(`select * from Profile where id = "${data}"`, (err, profiles)=>{
				if(!err){
					resolve(profiles)
				}else{
					reject(err)
				}
			})
		});
	}

	static editProfile(data){

		return new Promise((resolve, reject) => {
			db.run(`update Profile set username = "${data.username}", password = "${data.password}", id_contact= "${data.contact}" where id = "${data.id}"`, err=>{
				if(err){
					reject(err)
				}else{
					resolve()
				}
			})
		})
	}

	static deleteProfile(data){

		return new Promise((resolve, reject) => {
			db.run(`delete from Profile where id = "${data}"`, (err)=>{
				if(err){
					reject(err)
				}else{
					resolve()
				}
			})
		});
	}

	static getAllProfileContact(){

		return new Promise((resolve, reject) => {
			let profiles = this.getAllProfile()
			let contacts = Contact.getAllContact()

			Promise.all([profiles, contacts]).then(result=>{
				result[0].forEach(profile=>{
					result[1].forEach(contact=>{
						if(profile.id_contact === contact.id){
						   profile.name = contact.name
						}
					})
				})
				resolve(result)
			})
		})
	}


	static getProfileContactById(data){

		return new Promise((resolve, reject) => {
			this.getProfileById(data).then(result=>{
				Contact.getContactById(result.id_contact).then(kontak=>{
					result.name = kontak.name
					resolve(result)
				})
			})
		});
	}

	
}

module.exports = Profile