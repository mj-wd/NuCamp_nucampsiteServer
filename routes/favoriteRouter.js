const express = require('express');
const Favorite = require('../models/favorite');
const authenticate = require('../authenticate');
const cors = require('./cors');

const favoriteRouter = express.Router();

favoriteRouter.route('/')
.options(cors.corsWithOptions, (res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.find({ user: req.user._id })
    .populate('user')
    .populate('campsites')
    .then(favorites => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user._id})
    .then(favorite => {
        if (favorite) {
        req.body.forEach(campsite => {
            if (!favorite.campsites.includes(campsite._id)) {
                    favorite.campsites.push(campsite)
                }
        })
        favorite.save()
        .then(savedFavorite => {
            res.json(savedFavorite);
        })        
        } else {
            Favorite.create({user: req.user._id, campsites: req.body})
            .then(createdFavorite => {
                res.json(createdFavorite);
            })
        }
    })
    .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (next) => {
    const error = new Error ('Operation not supported.');
    error.staus = 403;
    next(error);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndDelete({user: req.user._id})
    .then(foundFavorite => {
        if (foundFavorite) {
            res.json(foundFavorite);
        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.end('You do not have any favorites to delete.');
        }
    })
    .catch(err => next(err));
});

favoriteRouter.route('/:campsiteId')
.options(cors.corsWithOptions, (res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, (next) => {
    const error = new Error ('Operation not supported.');
    error.staus = 403;
    next(error);
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user._id})
    .then(favorite => {
        if (favorite) {
            if (!favorite.campsites.includes(req.params.campsiteId)) {
                favorite.campsites.push({_id: req.params.campsiteId});
            } else {
                res.end('That campsite is already in the list of favorites!');
            }
            favorite.save().then(savedFavorite => {
                res.json(savedFavorite);
            })
        } else {
            Favorite.create({user: req.user._id, campsites: [{_id: req.params.campsiteId}]}).then(createdFavorite => {
                res.json(createdFavorite);
            })
        }
    })
    .catch(err => next(err));
})   
.put(cors.corsWithOptions, authenticate.verifyUser, (next) => {
    const error = new Error ('Operation not supported.')
    error.staus = 403;
    next(error);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    Favorite.findOne({user: req.user._id})
    .then(favorite => {
        if (favorite) {
            favorite.campsites = favorites.campsites.filter(campsite => {
                if (req.params.campsiteId !== campsite.toString()) {
                    return true;
                }
                return false;
            })
            favorite.save().then(savedFavorite => {
                res.json(savedFavorite);
            })
        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.end('You do not have any favorites to delete.');
        }
    }) 
});

module.exports = favoriteRouter;