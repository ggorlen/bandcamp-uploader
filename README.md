# bandcamp-uploader

Upload albums to bandcamp.

Work in progress, but does what I need it to do so far.

### Usage

See [`test-upload.js`](test-upload.js) for programmatic usage.

Running a quick test:

```
npm i
cp .env.sample .env # and add your BC artist credentials
node test-upload
```

### TODO

- handle upload errors
- rename all input fields in the album data structure to match BC's fields
- permit optional fields and validate album data structure
- handle album/track options not handled yet
- add merch and bonus item
- add better command line support or JSON file config
