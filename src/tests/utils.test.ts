// import { shuffle, getBackgroundImage, normalizeShows } from '@/utils/utils'
// import { expect, test, expectTypeOf } from 'vitest'
// import type { Show } from '@/types/types'

// test('should shuffle an array', () => {
//   const array = [1, 2, 3, 4, 5, 6, 7]
//   const shuffled = shuffle(array)
//   expect(shuffled).not.toEqual(array)
//   expect(shuffled.length).toEqual(array.length)
// })

// test('should return a background image', () => {
//   const images = [
//     {
//       type: 'background',
//       resolutions: {
//         original: {
//           width: 1920,
//           url: 'https://example.com/image.jpg'
//         }
//       }
//     }
//   ]
//   const background = getBackgroundImage(images)
//   expect(background).toBeTypeOf('string')
// })

// test('should normalize shows', () => {
//   const shows = [
//     {
//       id: 1,
//       name: 'Show 1',
//       image: {
//         medium: 'https://example.com/image.jpg',
//         original: 'https://example.com/image.jpg'
//       },
//       rating: {
//         average: 8.5
//       }
//     }
//   ]
//   const normalized = normalizeShows(shows)
//   expectTypeOf(normalized).toEqualTypeOf<Show[]>()
// })
