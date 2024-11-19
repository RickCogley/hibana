// Example my-plugins/css_banner.ts from Lume Docs

interface Options {
  message: string;
}

export default function (options: Options) {
  function addBanner(content: string): string {
    const banner = `/* ${options.message} */`;
    return banner + "\n" + content;
  }

  return (site: Site) => {
    site.process([".css"], (pages) => {
      for (const page of pages) {
        page.content = addBanner(page.content as string);
      }
    });
  };
}