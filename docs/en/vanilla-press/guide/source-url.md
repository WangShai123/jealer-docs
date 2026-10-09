# Source URL

Simplify the input of relative paths for image and video assets, and automatically resolve asset paths at build time based on page depth.

## Support

- Markdown Image `![alt](test.png)`
- HTML Image `<img src="test/test.png">`
- HTML Video `<video src="movie.mp4">`
- HTML Video Sub-Asset `<video><source src="movie.mp4"></video>`
- Extra Support for `video poster`
- `Absolute URL`, `Protocol Address`, `Root Path`, `data:` / `blob:` etc. remain unchanged.

## Input

Only the asset's relative path within `assets` needs to be entered. For example:

- For an asset in the first-level directory such as `assets/test.png`, enter the address as `test.png`.
- For an asset in a multi-level directory such as `assets/test/test.png`, enter the address as `test/test.png`.

## Output

When running `npm run build`, asset paths are automatically processed based on page depth to generate the correct relative paths.