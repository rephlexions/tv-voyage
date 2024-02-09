// type DynamicType<T extends string[]> = {
//   [Key in T[number]]: any
// }

// export default function createDynamicType<T extends string[]>(keys: T): DynamicType<T> {
//   const dynamicType: DynamicType<T> = {} as DynamicType<T>

//   keys.forEach((key) => {
//     dynamicType[key] = undefined // Initialize each property with 'undefined'
//   })

//   return dynamicType
// }
