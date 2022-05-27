const db = require('../../config/mongo.config')
const { ObjectId } = require('mongodb')
const coll = require('../collection')






module.exports = {
    // add theatre page POST -> /theatre/theatre
    addTheatre: (obj) => {
        return new Promise(async (res, rej) => {
            let theatre = await db.getDb().collection(coll.theatre).findOne({ theatreId: obj.theatreId })
            if (!theatre) {
                let theatre = await db.getDb().collection(coll.theatre).insertOne(obj)
                res({ theatre, status: true })
            } else {
                res({ status: false })
            }
        })
    },
    // show theatre
    showTheatre: (obj) => {
        return new Promise(async (res, rej) => {
            let theatre = await db.getDb().collection(coll.theatre).find({ theatreOwner: obj.theatreOwner }).toArray()
            if (theatre) {
                res(theatre)
            }
            else {
                res(false)
            }
        })
    },
    // find sigle theatre
    findTheatre: (obj) => {
        return new Promise(async (res, rej) => {
            try {
                let theatre = await db.getDb().collection(coll.theatre).findOne({ _id: ObjectId(obj) })
                if (theatre) {
                    res(theatre)
                } else res(false)
            } catch (error) {
                console.log(error)
            }


        })
    },
    updateTheatre: (obj) => {
        return new Promise(async (res, rej) => {
            try {
                hall = await db.getDb().collection(coll.theatre).updateOne({ "$and": [{ _id: ObjectId(obj.theatre_id) }, { theatreOwner: obj.theatreOwner }] }, {
                    "$set": {

                        theatreName: obj.theatreName,
                        BuildingName: obj.BuildingName,
                        address: obj.address,
                        city: obj.city,
                        theatreId: obj.theatreId,
                        theatreOwner: obj.theatreOwner,
                        images: obj.images,
                        Modified_date: (() => Date.now())()
                    }
                })
                res(hall)
            } catch (error) {
                console.log(error.message);
                res(false);

            }

        })
    },
    deleteTheatre: (obj) => {
        return new Promise(async (res, rej) => {
            try {
                let find = await db.getDb().collection(coll.theatre).findOne({ _id: ObjectId(obj._id), theatreOwner: obj.theatreOwner })
                let del = await db.getDb().collection(coll.theatre).deleteOne({ _id: ObjectId(obj._id), theatreOwner: obj.theatreOwner })
                let delHall = await db.getDb().collection(coll.screen).deleteMany({ theatre_id: obj._id })
                res(find);
            } catch (error) {
                console.log(error.message)
                res("delete rejected")
            }
        })
    },
    // add screen
    addScreen: (obj) => {
        return new Promise(async (res, rej) => {
            let hall = await db.getDb().collection(coll.screen).findOne({ $and: [{ screenId: obj.screenId }, { theatre_id: obj.theatre_id }] })
            if (!hall) {
                let inp = {
                    screenName: obj.screenName,
                    screenId: obj.screenId,
                    seats_details: {
                        totalColums: obj.seats_col_num,
                        seats: {
                            seats_tag_name: obj.seats_tag_name,
                            seats_number: obj.seats_number,
                            seats_price: obj.seats_price,
                            seats_category: obj.seats_category
                        }
                    }
                    ,
                    theatreOwner: obj.theatreOwner
                }
                let hall = await db.getDb().collection(coll.screen).insertOne(inp)
                let update = await db.getDb().collection(coll.theatre).updateOne({ _id: ObjectId(inp.theatreOwner) }, { "$set": { application_complete: true } })
                if (hall && update) {
                    res(hall)


                } else {
                    res(false)
                }
            } else res(false)

        })
    },
    showScreen: (obj) => {
        return new Promise(async (res, rej) => {
            let screen = await db.getDb().collection(coll.screen).find({ theatreOwner: obj }).toArray()
            if (screen) {
                res(screen)
            }
            else {
                res(false)
            }
        })
    },
    showSingleScreen: (obj) => {
        return new Promise(async (res, rej) => {
            let screen = await db.getDb().collection(coll.screen).findOne({ $and: [{ theatreOwner: obj.theatreOwner }, { _id: ObjectId(obj._id) }] });
            if (screen) {
                res(screen)
            }
            else {
                res(false)
            }
        })
    },
    deleteScreen: (obj) => {
        return new Promise(async (res, rej) => {
            try {
                let del = await db.getDb().collection(coll.screen).deleteOne({ _id: ObjectId(obj) })
                if (del) {
                    res(true);
                }
                else throw new error;
            } catch (error) {
                console.log(error.message)
                res(false)
            }
        })
    },
    //show all screen
    showAllScreen: (obj) => {
        return new Promise(async (res, rej) => {
            let screen = await db.getDb().collection(coll.screen).find({ theatreOwner: obj }).toArray()
            if (screen) {
                res(screen)
            }
            else {
                res(false)
            }
        })
    },
    //show all movies
    showMovies: (obj) => {
        return new Promise(async (res, rej) => {
            let movie = await db.getDb().collection(coll.movie).find({ theatreOwner: obj }).toArray()
            if (movie) {
                res(movie)
            }
            else {
                res(false)
            }
        })
    },
    showSingleMovie: (obj) => {
        return new Promise(async (res, rej) => {
            let movie = await db.getDb().collection(coll.movie).findOne({ $and: [{ theatreOwner: obj.theatreOwner }, { _id: ObjectId(obj.movieId) }] });
            if (movie) {
                res(movie)
            }
            else {
                res(false)
            }
        })
    }
    ,
    // add movie
    addMovie: (obj) => {
        return new Promise(async (res, rej) => {
            obj.Created_date = Date.now();
            let movie = await db.getDb().collection(coll.movie).findOne({ $and: [{ movie_uid: obj.movie_uid }, { theatreOwner: obj.theatreOwner }] })
            console.log(movie)
            if (!movie) {
                let movie = await db.getDb().collection(coll.movie).insertOne(obj)
                res({ movie, status: true })
            } else {
                res({ status: false })
            }
        })
    },
    updateMovie: (obj) => {
        return new Promise(async (res, rej) => {
            try {
                hall = await db.getDb().collection(coll.movie).updateOne({ "$and": [{ _id: ObjectId(obj.movie_id) }, { theatreOwner: obj.theatreOwner }] }, {
                    "$set": {

                        movieName: obj.movieName,
                        movie_uid: obj.movie_uid,
                        description: obj.description,
                        movieDuration: obj.movieDuration,
                        language: obj.language,
                        ReleseDate: obj.ReleseDate,
                        tlLinks: obj.tlLinks,
                        movieGenres: obj.movieGenres,
                        theatreOwner: obj.theatreOwner,
                        images: obj.images,
                        Modified_date: (() => Date.now())()
                    }
                })
                res(hall)
            } catch (error) {
                console.log(error.message);
                res(false);

            }

        })
    },
    deleteMovie: (obj) => {
        return new Promise(async (res, rej) => {
            try {
                let find = await db.getDb().collection(coll.movie).findOne({ _id: ObjectId(obj._id), theatreOwner: obj.theatreOwner })
                let del = await db.getDb().collection(coll.movie).deleteOne({ _id: ObjectId(obj._id), theatreOwner: obj.theatreOwner })

                res(find);
            } catch (error) {
                console.log(error.message)
                res(false)
            }
        })
    },
    viewMovie: (obj) => {
        return new Promise(async (res, rej) => {
            try {
                let find = await db.getDb().collection(coll.movie).findOne({ _id: ObjectId(obj._id), theatreOwner: obj.theatreOwner })
                res(find);
            } catch (error) {
                console.log(error.message);
                res(false)
            }
        })
    },
    ////lookup for movie and halls
    showCinema_screen: (obj) => {
        //=> obj = 
        return new Promise(async (res, rej) => {

            try {
                let result = await db.getDb().collection(coll.show).aggregate([
                    { $match: { "screen_id": obj } },
                    {
                        $lookup: {
                            from: coll.movie,
                            localField: "theatreOwn",
                            foreignField: "theatreOwner",
                            as: "all_Movies"
                        }

                    }, {
                        $unwind: "$all_Movies"
                    }
                ]).toArray();

                res(result)

            } catch (error) {
                console.log(error)
                rej(error)
            }


        })
    },
    AddShow: (obj) => {
        return new Promise(async (res, rej) => {
            try {
                let data = await db.getDb().collection(coll.show).findOne({ show_uid: obj.show_uid })

                if (data) {
                    res(false)
                } else {
                    let show = await db.getDb().collection(coll.show).insertOne(obj);
                    res(show)
                }
            } catch (error) {
                console.log(error)
            }
        })
    },
    // all shows
    AllShows: (obj) => {
        return new Promise(async (res, rej) => {
            let data = await db.getDb().collection(coll.show).find({ theatreOwn: obj }).toArray();
            console.log(data)
            if (data) {
                res(data)
            } else { res(false) }
        })
    },
    // all foods
    AllFoods: (obj) => {
        return new Promise(async (res, rej) => {
            let data = await db.getDb().collection(coll.food).find({ theatreId: obj }).toArray();
            console.log(data)
            if (data) {
                res(data)
            } else { res(false) }
        })
    },
    AddFood: (obj) => {
        return new Promise(async (res, rej) => {
            try {
                let data = await db.getDb().collection(coll.food).findOne({ food_uid: obj.food_uid })

                if (data) {
                    res(false)
                } else {
                    let food = await db.getDb().collection(coll.food).insertOne(obj);
                    res(food)
                }
            } catch (error) {
                console.log(error)
            }
        })
    },
    DeleteFood: (obj) => {
        return new Promise(async (res, rej) => {
            try {
                let find = await db.getDb().collection(coll.food).findOne({ _id: ObjectId(obj._id), theatreOwn: obj.theatreOwner })
                let del = await db.getDb().collection(coll.food).deleteOne({ _id: ObjectId(obj._id), theatreOwn: obj.theatreOwner })

                res(find);

            } catch (error) {
                console.log(error);
                res(false)
            }
        })
    }
}
