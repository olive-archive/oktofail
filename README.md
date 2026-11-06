# Your Portfolio Blog — Instructions for Humans

This guide assumes you know **nothing** about coding. Every task is written as numbered steps you can follow exactly. Nothing here requires you to understand how the site works — but a short explanation is included so the steps make sense.

**Contents**

1. [What's in this folder](#1-whats-in-this-folder)
2. [How the site works (the 60-second version)](#2-how-the-site-works-the-60-second-version)
3. [The six rules of JSON (read this once)](#3-the-six-rules-of-json-read-this-once)
4. [Getting an image ready](#4-getting-an-image-ready)
5. [Add a new blog post with an image](#5-add-a-new-blog-post-with-an-image)
6. [Add text](#6-add-text)
7. [Format text: bold, italic, links, line breaks](#7-format-text-bold-italic-links-line-breaks)
8. [Other things you can put in a post](#8-other-things-you-can-put-in-a-post)
9. [Edit the About page and your store links](#9-edit-the-about-page-and-your-store-links)
10. [Create a brand-new page](#10-create-a-brand-new-page)
11. [Change the site name, menu, footer, colours, font](#11-change-the-site-name-menu-footer-colours-font)
12. [Publishing: GitHub and Cloudflare, step by step](#12-publishing-github-and-cloudflare-step-by-step)
13. [Troubleshooting](#13-troubleshooting)
14. [Quick-reference cheat sheet](#14-quick-reference-cheat-sheet)

---

## 1. What's in this folder

```
your-site/
├── index.html          ← the one web page shell. Don't edit.
├── style.css           ← how things look (colours, fonts, widths). Edit only in section 11.
├── site.js             ← the "engine". Never edit.
├── preview.py          ← optional: preview on your own computer.
├── README.md           ← this guide.
├── wrangler.jsonc      ← settings file for Cloudflare. NEVER DELETE. (section 12)
├── .assetsignore       ← optional: keeps a few files from being public. (section 12)
├── images/             ← ★ ALL YOUR PICTURES GO HERE
└── content/            ← ★ ALL YOUR WORDS AND LAYOUT GO HERE
    ├── site.json       ← site name, menu, footer, how many posts load at once
    ├── posts/          ← ★ YOUR BLOG POSTS, one file per year
    │   ├── 2026.json   ← all your 2026 posts
    │   └── _template-year.json ← a blank file to copy when a new year starts
    └── pages/
        ├── home.json   ← the main blog page. It just says "show the posts". Rarely edited.
        ├── about.json  ← your About page
        └── _template.json ← a blank page to copy when you want a new page
```

**The only things you will normally touch:** the `images` folder and the files inside `content`.

## 2. How the site works (the 60-second version)

- Each page of your site is described in a **JSON file** in `content/pages/`. A JSON file is just a text file with a very strict way of writing a list of things.
- The page address matches the file name:

  | Visitor goes to | The site reads this file |
  |---|---|
  | `yoursite.com` | `content/pages/home.json` |
  | `yoursite.com/about` | `content/pages/about.json` |
  | `yoursite.com/exhibitions` | `content/pages/exhibitions.json` |

- A page is built from **blocks**, stacked top to bottom. A block is one thing: an image, some text, a heading, a row of buttons.
- Your blog (the main page) is made of **posts**. Each post has a date, an optional title, and its own blocks. Posts are kept in **one file per year** inside `content/posts/` (`2026.json`, `2027.json`, …). **You only ever edit the current year's file.** Visitors never see the year in the web address; it's only how the files are organised.
- The main page shows the **10 newest posts** with a **Load more** button. Each click shows 10 more, reaching back through the years automatically.

You never write HTML. You copy a block, change the words inside the quotation marks, and save.

## 3. The six rules of JSON (read this once)

JSON is picky. One missing comma and the page shows a red message. (That message tells you roughly which line to look at, so it is not dangerous — just fix and save again.)

1. **Use a plain-text editor, never Word, Pages or TextEdit in "rich text" mode.** Easiest option: edit directly on GitHub (section 12), which is a plain-text editor. Free alternative: [Visual Studio Code](https://code.visualstudio.com).
2. **All words are wrapped in straight double quotes** `"like this"`. Not curly quotes `“like this”` around the outside.
3. **Items in a list are separated by commas — but there is NO comma after the last item.**

   ```json
   "images": [
     { "src": "images/a.jpg" },
     { "src": "images/b.jpg" }
   ]
   ```
   (comma after the first `}`, none after the second)

4. **Everything that opens must close.** Every `{` needs a `}`, every `[` needs a `]`. When you copy a block, copy from its opening `{` all the way to its closing `}`.
5. **Never type a straight double quote `"` inside your text.** Use curly quotes instead — type “ and ” — or the code `\"`. Apostrophes are fine: `it's` works as is.

   ```json
   "text": "She said “hello” and it's fine."
   ```
6. **Never type a single backslash `\` in your text** (other than `\n` for a line break, see section 7).

> **Tip:** paste your file into [jsonlint.com](https://jsonlint.com) and press Validate. It points to the exact mistake. Also, once your site is live, a mistake in a file shows as a red box on the page naming the file and roughly which line to check.

## 4. Getting an image ready

Do this **before** you upload an image:

1. **Size:** make the image about **1520 pixels wide** (twice the 760px display width, so it stays sharp on high-resolution screens). Height can be anything. For very tall images it is fine to leave them taller.
2. **Format:** save as **JPG** (for paintings, drawings and photos). PNG is fine for flat graphics, but files are larger.
3. **File size:** aim for **under 500 KB**, and certainly under 1 MB. Most photo editors have an "Export" or "Save for web" option with a quality slider — about 80% quality is a good balance.
4. **File name:** use only **lowercase letters, numbers and dashes**. No spaces, no capital letters, no symbols.
   - Good: `harbor-study-2026.jpg`
   - Bad: `Harbor Study (final) 2.JPG`

   This matters: the site is case-sensitive, so `Harbor.jpg` and `harbor.jpg` are different files.
5. **Hidden details (privacy):** photos and exports can carry hidden information, such as the camera owner's name, the location where it was taken, and the date. If you want to keep this private, remove it before uploading. On Windows: right-click the file, choose **Properties**, then **Details**, then **Remove Properties and Personal Information**. On a Mac, Preview's Inspector (**Tools → Show Inspector**) can show and remove location information. Many image editors also have an export option to leave out metadata. Check one exported file before you upload a batch.

## 5. Add a new blog post with an image

### Step A — Upload the image

1. Go to your repository on GitHub.
2. Click the **`images`** folder.
3. Click **Add file → Upload files**.
4. Drag your image into the box. Wait for the progress bar to finish.
5. Scroll down and click the green **Commit changes** button.

### Step B — Add the post

1. In your repository, open **`content`**, then **`posts`**, then click the file for the current year, such as **`2026.json`**. (Starting a new year? See "When a new year starts" below.)
2. Click the **pencil icon** (Edit this file) at the top right.
3. Find this line near the top:

   ```json
   "posts": [
   ```
4. Press **Enter** after it to make a new empty line, and paste the following. **Change only the words inside the quotation marks.**

   ```json
       {
         "date": "2026-11-15",
         "title": "My new painting",
         "blocks": [
           {
             "type": "image",
             "src": "images/harbor-study-2026.jpg",
             "alt": "Oil painting of a harbor at dusk",
             "caption": "*Harbor Study*, 2026. Oil on panel."
           }
         ]
       },
   ```
5. Notice the **comma after the final `}`**. It's needed because another post follows below it.
6. Click **Commit changes…** (green button, top right), then **Commit changes** again. Your site updates in about a minute.

### What each line means

| Line | What it does | Required? |
|---|---|---|
| `"date"` | The post date. **Write it as year-month-day with dashes**, e.g. `2026-11-15`. Posts sort themselves newest first, so it doesn't matter where in the file you paste it. | Recommended |
| `"title"` | A small title above the post. | Optional — delete the whole line if you don't want one. |
| `"type": "image"` | Says this block is a picture. | Required |
| `"src"` | The image's location: `images/` followed by the exact file name. | Required |
| `"alt"` | A short description for people using screen readers, and for search engines. Describe what's in the picture in plain words. | Strongly recommended |
| `"caption"` | Small grey text below the image. | Optional |

> **Deleting an optional line?** Careful with commas. Every line inside a block needs a comma at the end **except the last line**. If you delete the caption line and it was the last line, remove the comma at the end of the line above it.

### Multiple images in one post

Add more blocks inside the `"blocks"` list, separated by commas:

```json
"blocks": [
  { "type": "image", "src": "images/one.jpg", "alt": "First image" },
  { "type": "image", "src": "images/two.jpg", "alt": "Second image" }
]
```

### Hiding a post without deleting it

Add `"draft": true,` as a line inside the post. It disappears from the site until you remove that line.

```json
{
  "draft": true,
  "date": "2026-12-01",
  ...
}
```

### Deleting a post

Delete everything from the post's opening `{` to its closing `}`, plus the comma after it. If it was the very last post in the list, delete the comma before it instead.

### When a new year starts

Do this once each January:

1. On GitHub open **`content` → `posts`** and click **`_template-year.json`**, then click the **Copy raw file** button (top right of the file view).
2. Go back to `posts`, click **Add file → Create new file**, and name it for the new year, e.g. **`2027.json`**.
3. Paste, then change the example post's date and words (or replace it with your own post).
4. Click **Commit changes…**.

That's all. You don't add the new file to a list. The site looks for the current year's file by itself, and goes back through earlier years as people click **Load more**. If you forget to create it, nothing breaks: the site simply shows the older posts until the file exists.

### Share a link to one post

Each post has a small **Copy link** under its date, on the right. Click it and the address of that post is copied. Paste it into an email or message, and the person who opens it lands on the blog, scrolled to that post (the site loads older posts automatically if it has to).

- The link looks like `yoursite.com/#2026-11-15-my-new-painting`. It is made from the post's date and title.
- **If you later change a post's title or date, its link changes too.** To keep a link stable, give the post its own name. Use only lowercase letters, numbers and dashes:

  ```json
  {
    "id": "harbor-study",
    "date": "2026-11-15",
    ...
  }
  ```
  The link is then `yoursite.com/#harbor-study`, whatever the title says.
- This is a link to a spot on the main page, not a separate page. A link preview, such as when you paste it into a chat, will show your site's general title and not that single post.
- **To change the button's wording:** open `site.js` and use Find and Replace (Ctrl+H on Windows, Cmd+Option+F on Mac). Replace **all three** places that contain `Copy link` (the button, the line that resets it after a click, and a comment), and also `Link copied` (the message shown after a click). Change only the words, not the quotation marks or anything around them.

## 6. Add text

Text is a block too. **Each piece of text inside the square brackets is a separate paragraph**, with a comma between paragraphs (none after the last):

```json
{
  "type": "text",
  "text": [
    "This is the first paragraph.",
    "This is the second paragraph."
  ]
}
```

For a single paragraph you can write it more simply:

```json
{ "type": "text", "text": "Just one short paragraph." }
```

Optional text settings (add a line inside the block, with a comma after the line above it):

| Add this | Result |
|---|---|
| `"align": "center"` | Centres the text |
| `"small": true` | Smaller, grey text — good for notes or credits |

A **heading** is a separate block:

```json
{ "type": "heading", "level": 2, "text": "Studio notes" }
```
`level` can be `1` (biggest, for page titles), `2` (section heading), or `3` (small heading).

## 7. Format text: bold, italic, links, line breaks

You format text with a few simple symbols **inside** the quotation marks. This works in text blocks, image captions, headings, post titles and the footer.

| You type | You get |
|---|---|
| `**bold words**` | **bold words** |
| `*italic words*` | *italic words* |
| `[Visit my shop](https://www.example.com)` | a clickable link reading "Visit my shop" |
| `[Email me](mailto:you@example.com)` | a link that opens an email |
| `[See my About page](/about)` | a link to another page on your site |
| `\n` | a line break *inside* a paragraph |

Examples:

```json
"caption": "*Harbor Study*, 2026. Oil on panel, 24 x 36 in.\nAvailable — [inquire here](mailto:you@example.com)"
```

```json
"text": "Prints are available in **three sizes**. See the [shop](https://www.example.com/shop)."
```

**Rules of thumb**

- Links to *other websites* must start with `https://` and open in a new tab automatically.
- Links to *your own pages* start with a slash: `/about`, `/exhibitions`.
- Works: accented letters (é, ñ), em dashes (—), ©, emoji. Type them normally.
- **Don't type a straight `"` inside text** (see rule 5). Use “curly quotes” instead.
- For a **new paragraph**, don't use `\n\n`. Make a new item in the list instead (section 6).

## 8. Other things you can put in a post

### Two or more images side by side

```json
{
  "type": "row",
  "images": [
    { "src": "images/left.jpg",  "alt": "Left image",  "caption": "Left" },
    { "src": "images/right.jpg", "alt": "Right image", "caption": "Right" }
  ]
}
```
Up to four images fit in a row. On phones they stack vertically.

### An image that is a link

```json
{ "type": "image", "src": "images/print.jpg", "alt": "Print", "link": "https://www.example.com/print" }
```

### A row of link buttons

```json
{
  "type": "links",
  "items": [
    { "label": "Etsy", "url": "https://www.example.com/etsy" },
    { "label": "Prints", "url": "https://www.example.com/prints" }
  ]
}
```

### A thin line, or extra empty space

```json
{ "type": "divider" }
{ "type": "spacer", "height": 80 }
```
(`height` is in pixels. Remember a comma between blocks in a list.)

### Prevent layout "jumping" (optional)

If you want the page not to shift as images load, add the image's real pixel size:

```json
{ "type": "image", "src": "images/a.jpg", "alt": "…", "width": 1520, "height": 1013 }
```
You can find those numbers by right-clicking the image file → Properties/Get Info. Entirely optional.

## 9. Edit the About page and your store links

1. On GitHub open **`content` → `pages` → `about.json`**, click the pencil icon.
2. Change the words in the `"text"` paragraphs.
3. For store links, edit the `"label"` (the button words) and `"url"` (where it goes) in the `"links"` block. To add another store, copy one line like
   `{ "label": "Etsy Shop", "url": "https://…" }`
   paste it below, and make sure there's a comma after every line except the last.
4. Commit changes.

You can also add images to the About page (such as a portrait) the same way as in section 5: use an image block.

## 10. Create a brand-new page

Example: adding an **Exhibitions** page at `yoursite.com/exhibitions`.

1. On GitHub open **`content` → `pages`**.
2. Click **`_template.json`**, then click the **Copy raw file** button (top right of the file view).
3. Go back to `pages`. Click **Add file → Create new file**.
4. In the name box type **`exhibitions.json`**.
   - **Name rules:** lowercase letters, numbers and dashes only. End with `.json`. The name becomes the address.
5. Paste the template and change the words. Add blocks as you like (sections 6–8).
6. Click **Commit changes…**.
7. **Add it to the menu:** open `content/site.json`, edit, and add a line to the `"nav"` list:

   ```json
   "nav": [
     { "label": "Blog",        "url": "/" },
     { "label": "About",       "url": "/about" },
     { "label": "Exhibitions", "url": "/exhibitions" }
   ],
   ```
   Commas between lines, none after the last. Commit.

The new page is live in a minute or so. Pages you don't add to the menu still work if someone knows the address — handy for private or "unlisted" pages.

> **Don't create a file called `404.html`** anywhere in the site, and **don't delete `wrangler.jsonc`**. Together they are what make addresses like `/about` work on Cloudflare (section 12).

## 11. Change the site name, menu, footer, colours, font

### Site name, menu, footer
Open `content/site.json`.

```json
{
  "title": "Your Name",
  "logo": "",
  "logoHeight": 40,
  "description": "Artwork and works in progress by Your Name.",
  "nav": [ ... ],
  "footer": "© {year} Your Name. All images are protected by copyright.",
  "firstYear": 2026,
  "postsPerLoad": 10,
  "cleanUrls": true
}
```
- `title` appears top left and in the browser tab. If you set a logo (below), the image replaces the text at the top left, but the title still shows in the browser tab and is read aloud to screen-reader users as the logo's description.
- `logo` is an optional image to show instead of your name. Leave it as `""` (two quotation marks with nothing between them) to show the text name.
- `logoHeight` is how tall the logo appears, in pixels. It is a plain number with no quotation marks. 40 is a good start; try 30 to 70.
- `description` is what search engines may show under your site's name.
- `{year}` in the footer is replaced by the current year automatically.
- `firstYear` is the year of your oldest post file. The site never looks for files before it. Leave it at 2026 unless you add posts from earlier years (then set it to that earlier year and create that year's file).
- `cleanUrls`: leave as `true`. It only matters if the menu links fail while you preview the site on your own computer or phone (see Troubleshooting, "Cannot GET /about").
- `postsPerLoad` is how many posts show at first, and how many more each **Load more** click adds. Change `10` to any number. Don't put quotation marks around it.

### Add a link to your shop in the menu

Add one line to the `"nav"` list in `content/site.json`:

```json
"nav": [
  { "label": "Blog", "url": "/" },
  { "label": "About", "url": "/about" },
  { "label": "Shop", "url": "https://your-shop-address.com" }
],
```
- Use the shop's full address, starting with `https://`. Links to other websites open in a new browser tab automatically.
- **Commas:** every line in the list needs a comma at the end **except the last one**. When you add a line below About, About needs a comma after its closing brace. Forgetting this is the most common cause of a red "typing mistake" box. Safari describes it as *Expected ']'*, and other browsers say *Expected ',' or ']'*.
- The order in the list is the order in the menu.

### Add a link in the footer (for example, your privacy policy)

Footer links are written the same way as links in text: `[the words people see](the address)`. Put it right after the copyright wording in the `"footer"` line:

```json
"footer": "© {year} Your Name. All images are protected by copyright. · [About & Privacy Policy](/about)",
```
- For a page on your own site, use just the page address, such as `/about`. For another website, use the full `https://…` address.
- **Do not write HTML** (`<a href="...">`). The straight quotation marks inside it end the footer text early and break the file.
- The line ends with a comma, because other lines follow it.

### Use an image logo instead of text

1. **Prepare the file.** Best is an **SVG** (stays sharp at any size). Otherwise use a **PNG with a transparent background**, saved at **twice the height** you want it displayed, so it stays sharp on phones. For example, a logo shown 40 pixels tall should be a PNG about 80 pixels tall. Transparent backgrounds matter because the site's background is a soft off-white, not pure white. A white-background JPG would show as a visible white box.
2. **Name it** with lowercase letters, numbers and dashes, such as `logo.png` or `logo.svg`.
3. **Upload it** into the `images` folder (section 5, Step A).
4. **Point the site at it.** On GitHub open `content/site.json`, click the pencil icon, and change the logo line to:

   ```json
   "logo": "images/logo.png",
   ```
   Keep the quotation marks and the comma at the end.
5. **Adjust the size** with `logoHeight` if needed, then click **Commit changes**.

To go back to the text name, change the line back to `"logo": "",`.

If the logo file can't be found (for example a spelling mistake), the site shows your text name instead, so the top of the page is never blank.

### Colours and widths
Open `style.css`. The first block of settings (inside `:root { … }`) is the control panel:

| Setting | What it changes |
|---|---|
| `--bg` | Background. `#fafaf8` is a soft off-white. `#ffffff` is pure white. `#f5f4f0` is slightly warmer/darker. |
| `--text` | Main text colour |
| `--muted` | Dates, captions, footer |
| `--container` / `--content` | The 900px container and 760px content widths |
| `--header-pad` | Space above and below your name/menu bar. Smaller makes the bar slimmer. |
| `--header-gap` | Space between the bar and the first post. |

**The sticky menu bar:** your name (or logo) and menu stay pinned at the top of the screen as people scroll, with a thin line under them once the page has moved. To turn this off, open `style.css`, find `position: sticky;` (inside the `.site-header` section) and change `sticky` to `static`. On phones, a very wide logo may make the bar wrap to two rows, so the logo is automatically limited to 44px tall on narrow screens.

Change only the part after the colon and before the semicolon. Colours are written as six characters after `#` — search for "colour picker" to find a code for any shade.

### Font
The site uses **Inter**, a clean modern typeface loaded free from Google Fonts. To try another (for example **DM Sans** or **Work Sans**):

1. Go to [fonts.google.com](https://fonts.google.com), choose a font, and copy the `<link href="https://fonts.googleapis.com/css2?family=…">` address it gives you.
2. In `index.html`, replace the Inter `<link href=…>` line with the new one.
3. In `style.css`, change `"Inter"` in the `--font:` line to the new font's name.

## 12. Publishing: GitHub and Cloudflare, step by step

How your site is put together, in plain words:

- **GitHub** stores your files, along with every earlier version of them.
- **Cloudflare** publishes them. Whenever you save a change on GitHub, Cloudflare notices and updates the live site, usually within a minute or two.
- Your **shop** (for example Fourthwall) can stay on your main domain. This blog lives on a subdomain such as `blog.yourdomain.com`. The two don't interfere with each other.

You do the setup **once**. After that, you only edit files on GitHub.

> Cloudflare and GitHub change their screens from time to time, so button names may differ slightly from those below. If a screen doesn't match, the goal of each step is the same.

### Part 1 — Put the site on GitHub

1. Create a free account at [github.com](https://github.com). **If you want to keep your real name off this project,** choose a username that isn't your name, then open **Settings → Emails** and turn on **Keep my email addresses private**.
2. Click the **+** at the top right → **New repository**. Name it something like `blog` (lowercase, no spaces). Public and private both work with Cloudflare. Click **Create repository**.
3. On the new empty repository page, click **uploading an existing file**. (Later, from the repository's main page, the same screen is under **Add file → Upload files**.)
4. Open your site folder on your computer and drag its **contents** into the box: `index.html`, `style.css`, `site.js`, `wrangler.jsonc`, `README.md`, `preview.py`, and the `images` and `content` folders. Don't drag the site folder itself, or `index.html` ends up one level too deep.
   - **Use Chrome or Firefox for uploading.** Dropping whole folders is unreliable in Safari.
   - If GitHub says *"Something went really wrong, and we can't process that file"*, upload in smaller batches, committing after each: first the loose files, then the `images` folder, then the `content` folder. Leave out hidden files such as `.DS_Store`.
5. Scroll down and click **Commit changes**.

> **Check:** `index.html`, `site.js`, `style.css`, `wrangler.jsonc` and the `images` and `content` folders should be listed on the repository's main page, not inside another folder.

### Part 2 — The settings file (`wrangler.jsonc`)

Cloudflare needs a small settings file at the top level of your repository, named exactly `wrangler.jsonc`. It tells Cloudflare where your site files are, and it makes addresses like `/about` work. It looks like this:

```jsonc
{
  "name": "your-worker-name",
  "compatibility_date": "2026-11-01",
  "assets": {
    "directory": "./",
    "not_found_handling": "single-page-application"
  }
}
```

- `name` must **exactly match your Worker's name in Cloudflare**. That's the first part of its `.workers.dev` address, before the first dot.
- Leave the other lines alone.
- **Never delete this file.** Without it, `/about` and other page addresses stop working, though `/?p=about` still would.

**Optional: keep a few files from being public.** Everything in the repository is published, including `README.md` and `preview.py`. To hide them, create a file named exactly `.assetsignore` (the dot at the start matters) containing:

```
wrangler.jsonc
README.md
preview.py
```

Your computer may hide or refuse dot-files, so create it on GitHub: **Add file → Create new file**, type `.assetsignore` as the name, paste the three lines, and commit.

### Part 3 — Connect GitHub to Cloudflare

1. Create a free account at [cloudflare.com](https://www.cloudflare.com).
2. In the dashboard open **Workers & Pages**, click **Create application**, and choose the option to connect a **Git repository**. Authorize GitHub when asked and pick your repository.
3. Leave the **build command** empty. If a **deploy command** is already filled in (normally `npx wrangler deploy`), leave it.
4. Save and deploy. You'll get a free address ending in `.workers.dev`. Open it, check the home page, then add `/about` to the end of the address and check that the About page loads.

### Part 4 — Put the blog on `blog.yourdomain.com`

This assumes your domain's DNS is managed by Cloudflare.

1. In **Workers & Pages**, open your Worker.
2. Go to **Settings → Domains & Routes → Add → Custom Domain**.
3. Type `blog.yourdomain.com` (using your real domain) and click **Add Custom Domain**.
4. Wait a few minutes. Cloudflare creates the DNS record and a security certificate for you.
5. Open `https://blog.yourdomain.com` and `https://blog.yourdomain.com/about` to check.

**If Cloudflare reports a conflict:** you can't add a custom domain to a name that already has a **CNAME** record. Open **DNS → Records** for your domain and delete only a record named `blog`. **Never change the other records**, especially the ones for your main domain. Your shop depends on them.

Your free `.workers.dev` address keeps working alongside the custom domain. Adding the shop link to your menu and a footer link is in section 11.

### Everyday editing workflow

1. Upload new images into `images/` (section 5, Step A).
2. Edit the current year's posts file (such as `content/posts/2026.json`) on GitHub and click **Commit changes** (section 5, Step B).
3. Wait about a minute, then refresh your site. If you don't see changes, do a hard refresh (**Ctrl+Shift+R** on Windows, **Cmd+Shift+R** on Mac).

**Undoing a mistake:** on GitHub open the file, click **History**, pick an earlier version, and copy its contents back. Every change you've ever made is saved.

### Optional: preview before publishing

If Python is installed, open a terminal in the site folder and run `python3 preview.py`, then open `http://localhost:8000`. VS Code's "Live Server" also works, including on your phone through port forwarding. Not required.

### Keeping your real name out of it

If this is a pseudonymous project, check each of these:

- **Domain registration:** turn on your registrar's privacy option, so your name and address aren't shown in public lookups.
- **GitHub:** use a username that isn't your name, turn on **Keep my email addresses private**, and set a display name you're happy to show.
- **Image files:** remove hidden details before uploading (section 4, step 5).
- **Your shop:** check what name or business details your shop platform shows to customers, on receipts and in emails.
- **This site:** use your pen name in `title` and in the `footer` text in `content/site.json`.

## 13. Troubleshooting

| What you see | What it means | Fix |
|---|---|---|
| A red box: *"The file … has a typing mistake in it"* | A JSON rule was broken (usually a missing or extra comma, quote or bracket). | Read the "near line N" hint, go to that line **and the one just above it**. Check commas and quotes. Paste the file into jsonlint.com for the exact spot. If you can't find it, use **History** on GitHub to go back to the last working version. |
| A red box: *"Could not load image: images/…"* | The file name in the JSON doesn't match the uploaded file. | Check spelling, capital letters, and the extension (`.jpg` vs `.jpeg`). Confirm the file is inside the `images` folder. |
| Red box: *"unknown block type"* | The `"type"` is misspelled. | Allowed types: `image`, `row`, `text`, `heading`, `links`, `divider`, `spacer`. |
| "Cannot GET /about" when previewing on your own computer | Your preview tool (for example VS Code "Live Server") only serves files that exist, and `/about` is not a file. | The site handles this automatically when it recognises it's being previewed: on your own computer, on other devices on your home network (such as your phone), and through common port-forwarding tunnels, menu links look like `/?p=about` and work in Live Server. If you still see the message, either you typed `/about` into the address bar yourself (use `/?p=about` instead), or your preview address wasn't recognised. In that case open `content/site.json` and change `"cleanUrls": true` to `"cleanUrls": false`. That makes the menu use the `/?p=about` style everywhere, which works on any server. **Change it back to `true` before publishing** if you want clean addresses like `yoursite.com/about` (the site still works if you forget). On your live site, `/about` works as long as `wrangler.jsonc` is in your repository (section 12). |
| `/about` shows an error on the live site, but `/?p=about` works | Cloudflare isn't set to show your main page for page addresses. | Check that `wrangler.jsonc` is at the top level of your repository, that its `"name"` matches your Worker's name exactly, and that there is no `404.html`. Then check your Worker's build log for errors. Quick workaround: set `"cleanUrls": false` in `content/site.json`. |
| Cloudflare's build fails after you changed something | A settings file is wrong or missing. | Open the failed build in Cloudflare and read the error. Your previous site stays live meanwhile. Most often it's a typo in `wrangler.jsonc`, or a name that doesn't match your Worker. |
| GitHub says *"Something went really wrong, and we can't process that file"* | Dragging whole folders failed, most often in Safari. | Use Chrome or Firefox, and upload in smaller batches (section 12, Part 1). |
| GitHub's editor says "switch to editor" and nothing happens | The editor didn't load, usually due to the browser or a content blocker. | Try Chrome or Firefox, turn off content blockers for github.com, or press `e` while viewing the file. As a fallback, edit the file on your computer and upload it over the old one with **Add file → Upload files**. |
| The menu or footer link breaks the whole page | A comma is missing, or HTML was typed into the text. | Menu: a comma after every line except the last (section 11). Footer: use `[words](/about)`, never `<a href="...">`. |
| "Page not found" | There's no JSON file with that name. | Make sure the file is in `content/pages/`, lowercase, ending in `.json`, and the address matches. |
| My edit doesn't show | Browser or Cloudflare hasn't updated yet. | Wait 1–2 minutes, then hard refresh. In Cloudflare, open your Worker and check its **Deployments** or **Builds** page for a success message. |
| A new post doesn't appear | It may be marked `"draft": true`, it may be in the wrong year's file, or it's just below the first 10 posts. | Remove the draft line. Make sure you edited the right file in `content/posts/`. Click **Load more** at the bottom of the page. |
| A red box: *"Problem in content/posts/2026.json"* | That year's file has a typing mistake. Only that year is affected. The other years still show. | Follow the line hint in the box and fix it (see the first row of this table). |
| "There are no posts yet." | The site found no posts file. | Check that `content/posts/2026.json` exists, and that `firstYear` in `site.json` isn't later than the year of your posts file. |
| A shared post link goes to the top of the page | The post's link name changed because its title or date was edited. | Give the post its own `"id"` (section 5, "Share a link to one post") and share the new link. |
| A post is in a new year but doesn't show | The year's file doesn't exist yet, or has the wrong name. | Create `content/posts/2027.json` (section 5, "When a new year starts"). The name must be the four-digit year plus `.json`. |
| Posts are out of order | One post has a date not in `YYYY-MM-DD` form. | Make all dates look like `2026-11-15`. (When every date is correct, newest posts show first automatically.) |
| Text looks strange, with `**` showing | Asterisks aren't paired. | Each bold or italic section needs a starting and ending mark. |
| Page blank and nothing shows | JavaScript blocked or `site.js` was not uploaded. | Confirm `site.js` and `style.css` are in the top level of the repository. |

## 14. Quick-reference cheat sheet

**A complete post to copy** (goes inside the `"posts": [ ... ]` list of the current year's file in `content/posts/`; newest posts show first automatically):

```json
{
  "id": "optional-link-name",
  "date": "2026-11-15",
  "title": "Optional title",
  "blocks": [
    {
      "type": "image",
      "src": "images/file-name.jpg",
      "alt": "Describe the image",
      "caption": "*Title*, 2026. Medium, size."
    },
    {
      "type": "text",
      "text": [
        "First paragraph.",
        "Second paragraph with **bold**, *italic* and a [link](https://www.example.com)."
      ]
    }
  ]
},
```

**Block types:** `image` · `row` · `text` · `heading` · `links` · `divider` · `spacer`

**Formatting:** `**bold**` · `*italic*` · `[words](https://link)` · `\n` line break

**Always:** straight quotes around words · commas between items · no comma after the last item · matching `{ }` and `[ ]` · no straight `"` inside text.

**Images:** about 1520 px wide, JPG, under 500 KB, lowercase-with-dashes file names, uploaded to `images/`.

**A menu link to another website:** `{ "label": "Shop", "url": "https://your-shop-address.com" }`

**A link inside the footer:** `[About & Privacy Policy](/about)`

**Never delete:** `wrangler.jsonc`. **Never create:** `404.html`.
