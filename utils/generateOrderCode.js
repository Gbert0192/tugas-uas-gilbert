import uuid4 from "uuid4";

const generateOrderCode = () => {
  const uuid = uuid4(); // Generate UUID
  const shortUuid = uuid.split("-")[0];
  const orderCode = `GMT-${shortUuid}`;
  return orderCode;
};

export default generateOrderCode;
