// // Local storage utilities for managing users, cars, and fines

// export interface User {
//   id: string;
//   fullName: string;
//   email: string;
//   password: string;
//   isAdmin?: boolean;
// }

// export interface Car {
//   id: string;
//   userId: string;
//   brand: string;
//   plateNumber: string;
// }

// export interface Fine {
//   id: string;
//   carId: string;
//   description: string;
//   amount: number;
//   date: string;
//   isPaid: boolean;
// }

// export const storage = {
//   // Users
//   getUsers(): User[] {
//     if (typeof window === "undefined") return [];
//     const users = localStorage.getItem("users");
//     return users ? JSON.parse(users) : [];
//   },

//   saveUsers(users: User[]) {
//     localStorage.setItem("users", JSON.stringify(users));
//   },

//   getUserByEmail(email: string): User | undefined {
//     return this.getUsers().find((u) => u.email === email);
//   },

//   createUser(user: Omit<User, "id">): User {
//     const users = this.getUsers();
//     const newUser = { ...user, id: crypto.randomUUID() };
//     users.push(newUser);
//     this.saveUsers(users);
//     return newUser;
//   },

//   // Cars
//   getCars(): Car[] {
//     if (typeof window === "undefined") return [];
//     const cars = localStorage.getItem("cars");
//     return cars ? JSON.parse(cars) : [];
//   },

//   saveCars(cars: Car[]) {
//     localStorage.setItem("cars", JSON.stringify(cars));
//   },

//   getCarsByUserId(userId: string): Car[] {
//     return this.getCars().filter((c) => c.userId === userId);
//   },

//   createCar(car: Omit<Car, "id">): Car {
//     const cars = this.getCars();
//     const newCar = { ...car, id: crypto.randomUUID() };
//     cars.push(newCar);
//     this.saveCars(cars);
//     return newCar;
//   },

//   // Fines
//   getFines(): Fine[] {
//     if (typeof window === "undefined") return [];
//     const fines = localStorage.getItem("fines");
//     return fines ? JSON.parse(fines) : [];
//   },

//   saveFines(fines: Fine[]) {
//     localStorage.setItem("fines", JSON.stringify(fines));
//   },

//   getFinesByCarId(carId: string): Fine[] {
//     return this.getFines().filter((f) => f.carId === carId);
//   },

//   createFine(fine: Omit<Fine, "id">): Fine {
//     const fines = this.getFines();
//     const newFine = { ...fine, id: crypto.randomUUID() };
//     fines.push(newFine);
//     this.saveFines(fines);
//     return newFine;
//   },

//   updateFine(id: string, updates: Partial<Fine>) {
//     const fines = this.getFines();
//     const index = fines.findIndex((f) => f.id === id);
//     if (index !== -1) {
//       fines[index] = { ...fines[index], ...updates };
//       this.saveFines(fines);
//     }
//   },

//   // Current user session
//   getCurrentUser(): User | null {
//     if (typeof window === "undefined") return null;
//     const userId = localStorage.getItem("currentUserId");
//     if (!userId) return null;
//     return this.getUsers().find((u) => u.id === userId) || null;
//   },

//   setCurrentUser(userId: string) {
//     localStorage.setItem("currentUserId", userId);
//   },

//   logout() {
//     localStorage.removeItem("currentUserId");
//   },
// };
