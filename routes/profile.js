const express = require('express')
const router = express.Router()
const Model = require('../models/profilesModel')

router.get('/', (req, res)=>{
	// Model.getAllProfile(rows=>{
	// 	res.render('profile', {profiles : rows})
	// })

	Model.getAllProfileContact(result=>{
		// console.log(result);
		// res.send(result.profiles)
		let message = ""
		res.render('profile', {profiles : result.profiles, contacts : result.contacts, message})
	})
})

router.post('/', (req, res)=>{
	Model.addProfile(req.body, (err)=>{
		if(!err){
			res.redirect('/profiles')	
		}else{
			Model.getAllProfileContact(result=>{
				let message = "Your contact already have profile"
				res.render('profile', {profiles : result.profiles, contacts : result.contacts, message})
			})
		}
		
	})
})

router.get('/edit/:id', (req, res)=>{
	Model.getProfileContactById(req.params.id, result=>{
		// res.send(result)
		res.render('editProfile', {profile : result.profile, contacts : result.contacts})
	})
})

router.post('/edit/:id', (req, res)=>{
	req.body.id = req.params.id
	Model.editProfile(req.body, ()=>{
		res.redirect('/profiles')
	})
})

router.get('/delete/:id', (req, res)=>{
	Model.deleteProfile(req.params.id, ()=>{
		res.redirect('/profiles')
	})
})

module.exports = router