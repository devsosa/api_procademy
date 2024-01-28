class Apifeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    //agregando el $ a gte gt lte lt
    const queryCopy = {...this.queryStr};
    const removeFields = ['sort','fields','limit','page'];
    removeFields.forEach((el) => delete queryCopy[el]);
    let queryString = JSON.stringify(queryCopy);
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    const queryObj = JSON.parse(queryString);
    
    // console.log(queryObj);
    
    this.query = this.query.find(queryObj);

    return this;

    //Filtro avanzado
    //objeto obtenido por la peticion get
    /* {
      duration: { gte: '90' },
      ratings: { gte: '5' },
      price: { lte: '100' }
    } */

    //Objeto que se debe pasar
    // find({duration: {$gte: 90}, ratings: {$gte: 5}, price: {$lte: 100}})
  }

  sort() {
    /* SORT - validando que se este pasando el parametro sort */
    if (this.queryStr.sort) {
      //http://localhost:3000/api/v1/movies?sort=-ratings,duration
      const sortBy =  this.queryStr.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      //Filtro por defecto
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limit() {
    //LIMITING FIELDS
    //http://localhost:3000/api/v1/movies?fields=name,duration,price,ratings
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    //PAGINATION
    const page = Number(this.queryStr.page) || 1;
    const limit = Number(this.queryStr.limit) || 10;
    const skip = (page - 1) * limit
    this.query = this.query.skip(skip).limit(limit);


    /* if (this.queryStr.page) {
      const moviesCount = await Movie.countDocuments();
      if (skip >= moviesCount) {
        throw new Error("This page is not found!");
      }
    } */

    return this;
  }
}

module.exports = Apifeatures;