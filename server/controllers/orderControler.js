const { createOrder, getAllOrders, getOrderById, updateOrder, deleteOrder }=require("../service/orderService")


const create = async (req, res) => {
  try {
    const order = await createOrder(req.body);
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getAll = async (req, res) => {
  try {
    const orders = await getAllOrders();
    if (orders.length === 0) {
      return res.status(404).json({ message: 'No orders found' });
    }
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await getOrderById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await updateOrder(id, req.body);
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await deleteOrder(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { create, getAll, getById, update, remove };











