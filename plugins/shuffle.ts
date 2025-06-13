/**
 * @file This file contains a Lume plugin for shuffling arrays.
 * @author Rick Cogley (refactored)
 * @see Original implementation introduced by @pixeldesu from their https://github.com/pixeldesu/pixelde.su repository.
 */

import type { Site } from "../types/lume.ts";
import { merge } from "../types/lume.ts";

/**
 * Options interface for the shuffle plugin.
 */
export interface Options {
  /**
   * Defines the name of the shuffle helper/filter.
   * @property {string} [shuffle="shuffle"] - The name for the shuffle filter.
   */
  names?: {
    shuffle?: string;
  };
}

/**
 * Default options for the shuffle plugin.
 */
export const defaults: Options = {
  names: {
    shuffle: "shuffle",
  },
};

/**
 * A Lume plugin to register the filter "shuffle" that shuffles an array.
 *
 * This plugin adds a new filter named "shuffle" (by default) that can be used
 * in your Lume templates to randomly reorder elements in an array.
 *
 * @param userOptions - Optional user-defined options to override the defaults.
 * @returns A Lume plugin function that registers the shuffle filter.
 * 
 * @example
 * // In your Lume _config.ts:
 * import lume from "lume/mod.ts";
 * import { shuffle, cssBanner } from "hibana/mod.ts";
 * 
 * site.use(shuffle());
 * 
 * export default site;
 *
 * // In your Vento templates:
 * {{ [1, 2, 3, 4, 5] | shuffle }}
 * // This will output a randomly shuffled array, e.g., [3, 1, 5, 2, 4].
 * 
 * {{ for testimonial of testimonials.list |> shuffle }}
 * // Use when building a list of testimonials in a for loop, shuffling their order.
 * 
 */
export function shuffle(userOptions?: Options) {
  const options = merge(defaults, userOptions);
  return (site: Site) => {
    site.filter(options.names.shuffle!, <T>(array: T[] = []) => {
        // Fisher-Yates (Knuth) shuffle algorithm
        for (let i = array.length - 1; i >= 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
        return array;
      }
    );
  };
}

export default shuffle;



// Original filter for _config.ts:
// site.filter("shuffle", <T>(array: T[] = []) => {
//   for (let i = array.length - 1; i >= 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [array[i], array[j]] = [array[j], array[i]];
//   }
//   return array;
// });


