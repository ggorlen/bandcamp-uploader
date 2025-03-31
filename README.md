# bandcamp-uploader

Upload albums to bandcamp.

Work in progress, but does what I need it to do so far.

### Usage

```
npm i
cp .env.sample .env # and add your BC artist credentials
node index # modify code to meet your needs
```

### TODO

- handle upload errors
- rename all input fields in the album data structure to match BC's fields
- add more parameters for timeout control and so forth to config
  - maybe allow client to pass a `page` in
- permit optional fields and validate album data structure
- handle album/track options not handled yet
- add merch and bonus item
