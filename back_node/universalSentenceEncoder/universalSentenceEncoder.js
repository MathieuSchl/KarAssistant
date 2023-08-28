const tf = require("@tensorflow/tfjs");
try {
  require("@tensorflow/tfjs-node");
} catch {}
const use = require("@tensorflow-models/universal-sentence-encoder");
let model = use.load();

module.exports.encodeSentence = async (sentence) => {
  // Encodage de la phrase en vecteur
  const embeddings = await model.embed(sentence);
  const result = {
    kept: embeddings.kept,
    isDisposedInternal: embeddings.isDisposedInternal,
    shape: embeddings.shape,
    dtype: embeddings.dtype,
    size: embeddings.size,
    strides: embeddings.strides,
    dataId: embeddings.dataId,
    id: embeddings.id,
    rankType: embeddings.rankType,
    scopeId: embeddings.scopeId
  }

  return result;
};

module.exports.compareSentences = async (embedding1, embedding2) => {
  return (await tf.losses.cosineDistance(embedding1, embedding2).data())[0];
};

module.exports.start = async () => {
  if (model.then) model = await model;
  return true;
};
