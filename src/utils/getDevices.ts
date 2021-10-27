const handleError = (err: any) => {
  console.log("err:", err);
};

const getDevices = () => {
  return new Promise((resolve) => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      console.log("enumerateDevices is not supported");
    } else {
      navigator.mediaDevices
        .enumerateDevices()
        .then(resolve)
        .catch(handleError);
    }
  });
};

export default getDevices;
