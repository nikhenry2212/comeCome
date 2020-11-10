export default class Matrix {
  constructor(rows, cols) {
      this.rows = rows;
      this.cols = cols;

      this.data = [];
      for (let i = 0; i < rows; i++) {
          let arr = [];
          for (let j = 0; j < cols; j++) {
              arr.push(0);
          }
          this.data.push(arr);
      }
  }

  print() {
      console.table(this.data);
  }

  map(func) {
      this.data = this.data.map((arr, i) => {
          return arr.map((num, j) => {
              return func(num, i, j);
          });
      });
  }

  static map(A, func) {
      let matrix = new Matrix(A.rows, A.cols);

      matrix.data = A.data.map((arr, i) => {
          return arr.map((num, j) => {
              return func(num, i, j);
          });
      });
      return matrix;
  }

  randomize(n = 1) {
      this.map((elem, i, j) => {
          return Math.floor(Math.random() * (n * 2) + (n * -1));
      });
  }

  static add(A, B) {
      var matrix = new Matrix(A.rows, B.cols);
      matrix.map((num, i, j) => {
          return A.data[i][j] + B.data[i][j];
      });
      return matrix;
  }

  static subtract(A, B) {
      var matrix = new Matrix(A.rows, B.cols);
      matrix.map((num, i, j) => {
          return A.data[i][j] - B.data[i][j];
      });
      return matrix;
  }

  static escalar_multiply(A, escalar) {
      var matrix = new Matrix(A.rows, A.cols);
      matrix.map((num, i, j) => {
          return A.data[i][j] * escalar;
      });
      return matrix;
  }

  static transpose(A) {
      var matrix = new Matrix(A.cols, A.rows);
      matrix.map((num, i, j) => {
          return A.data[j][i];
      });

      return matrix;
  }

  static hadamard(A,B) {
      var matrix = new Matrix(A.rows, B.cols);
      matrix.map((num, i, j)=> {
          return A.data[i][j] * B.data[i][j];
      });
      return matrix;
  }

  static multiply(A, B) {
      var matrix = new Matrix(A.rows, B.cols);
      matrix.map((num, i, j) => {
          let sum = 0;
          for (let k = 0; k < A.cols; k++) {
              let elem1 = A.data[i][k];
              let elem2 = B.data[k][j];
              sum += elem1 * elem2;
          }
          return sum;
      });
      return matrix;
  }

  mutation(n = 0.1) {
      this.map((elem, i, j) => {
          const nn = elem * n;
          return elem + (Math.random() * (nn * 2) + (nn * -1))
      })
  }

  static arrayToMatrix(arr) {
      let matrix = new Matrix(arr.length, 1);

      matrix.map((elem, i, j) => {
          return arr[i];
      });
      return matrix;
  }

  static matrixToArray(obj) {
      let arr = [];
      obj.map((elem, i, j) => {
          arr.push(elem);
      });
      return arr;
  }
}