// shuffle filter for shuffling arrays
// introduced by @pixeldesu from their https://github.com/pixeldesu/pixelde.su repository 
// Original filter for _config.ts:
// site.filter("shuffle", <T>(array: T[] = []) => {
//   for (let i = array.length - 1; i >= 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [array[i], array[j]] = [array[j], array[i]];
//   }
//   return array;
// });

import { merge } from "lume/core/utils/object.ts";
import type Site from "lume/core/site.ts";

export interface Options {
  /** The shuffle helper name */
  names?: {
    shuffle?: string;
  };
}

export const defaults: Options = {
  names: {
    shuffle: "shuffle",
  },
};

/**
 * A plugin to register the filter "shuffle" that shuffles an array
 */

export function shuffle(userOptions?: Options) {
  const options = merge(defaults, userOptions);
  return (site: Site) => {
    site.filter(options.names.shuffle!, "shuffle", <T>(array: T[] = []) => {
        for (let i = array.length - 1; i >= 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      }
    );
  };
}

export default shuffle;

/* Extends Helpers interface */
// declare global {
//   namespace Lume {
//     export interface Helpers {
//     /* @see https://github.com/rickcogley/hibana/plugins/shuffle.ts */
//       shuffle: (path: string, absolute?: boolean) => string;
//     }
//   }
// }