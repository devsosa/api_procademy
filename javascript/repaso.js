/* ARRAYS */
// Recorrer un array
const vals = [1,2,3,4,5];
const people = [
  {name: 'Carlos', age: 20},
  {name: 'Karla', age: 25},
  {name: 'Franco', age: 15},
  {name: 'Estela', age: 17},
  {name: 'Juan', age: 40}
];

/* for (let i = 0; i < vals.length; i++) {
  console.log(vals[i]);
}
 */

/* for each  */
// recibe una funcion a ejecutar | callback
// ejecuta la funccion para cada elemento del array
//vals.forEach((value, index, array) => {
  //console.log('index: ', index);
  //console.log(value);
  //console.log('array: ', array);
//});

/* filter */
const result = vals.filter((number) => {
  return number % 2 !== 0;
});

const mayores = people.filter((person) => person.age >= 18);

console.log(mayores);