const isLogedIn = (req, res, next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl
        console.log(req.session.redirectUrl)
        req.flash("error", "You must loged in to add listings!")
        return res.redirect("/user/signin")
    }
    next()
}

const saveRedirectUrl = (req, res, next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl 
    }
    next()
}

export {isLogedIn, saveRedirectUrl}