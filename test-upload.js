import dotenv from "dotenv";
import { uploadAlbum } from "./src/index.js";

dotenv.config();
const username = process.env.BANDCAMP_USERNAME;
const password = process.env.BANDCAMP_PASSWORD;

const sampleAlbum = {
  private: true,
  title: "sample title",
  artist: "sample artist",
  art: "sample_data/sample.png",
  price: "6.66",
  about: "sample about",
  release_date: "10/10/2020",
  tags: "noise, static",
  cat_number: "42",
  upc: "123",
  credits: "sample album credits",
  enablePayMore: true,
  enablePreorder: false,
  tracks: [
    {
      file: "sample_data/sample.wav",
      title: "sample track",
      price: "0",
      enablePurchase: false,
      fansPayIfWant: false,
      requireEmail: false,
      about: "",
      lyrics: "",
      credits: "",
      artist: "",
    },
    {
      file: "sample_data/sample.wav",
      title: "another sample track",
      price: "0",
      enablePurchase: false,
      fansPayIfWant: false,
      requireEmail: false,
      about: "",
      lyrics: "",
      credits: "",
      artist: "",
    },
  ],
};
uploadAlbum(sampleAlbum, { username, password }).catch(console.error);
