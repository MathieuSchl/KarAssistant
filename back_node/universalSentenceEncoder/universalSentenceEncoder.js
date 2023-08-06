const tf = require("@tensorflow/tfjs");
//require("@tensorflow/tfjs-node");
const use = require("@tensorflow-models/universal-sentence-encoder");
let model = use.load();

module.exports.encodeSentence = async (sentence) => {
  // Encodage de la phrase en vecteur
  const embeddings = await model.embed(sentence);

  return embeddings;
};

module.exports.compareSentences = async (embedding1, embedding2) => {
  return (await tf.losses.cosineDistance(embedding1, embedding2).data())[0];
};

module.exports.start = async () => {
  if (model.then) model = await model;
  return true;
};
