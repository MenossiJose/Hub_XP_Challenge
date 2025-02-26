const mongoose = require('mongoose');
const { Schema } = mongoose;

// Definir os schemas de forma simplificada
const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  categoryIds: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  imageUrl: String,
});

const OrderSchema = new Schema({
  date: { type: Date, required: true, default: Date.now },
  productIds: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  total: { type: Number, required: true },
});

// Definir os modelos
let Product, Order;

// Função para conectar ao MongoDB
const connectToDatabase = async (uri) => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Inicializar modelos após a conexão
    Product = mongoose.model('Product', ProductSchema);
    Order = mongoose.model('Order', OrderSchema);
  }
  return {
    Product,
    Order,
  };
};

// Função para gerar relatório de vendas
const generateSalesReport = async (orders) => {
  // Relatório diário
  const dailySales = {};

  // Relatório por produto
  const productSales = {};

  // Processar pedidos
  for (const order of orders) {
    // Formatar a data (YYYY-MM-DD)
    const dateKey = order.date.toISOString().split('T')[0];

    // Adicionar ao relatório diário
    if (!dailySales[dateKey]) {
      dailySales[dateKey] = {
        totalAmount: 0,
        orderCount: 0,
      };
    }

    dailySales[dateKey].totalAmount += order.total;
    dailySales[dateKey].orderCount += 1;

    // Processar produtos do pedido
    for (const productId of order.productIds) {
      const productIdStr = productId.toString();

      if (!productSales[productIdStr]) {
        productSales[productIdStr] = {
          count: 0,
          totalAmount: 0,
        };
      }

      // Como não temos o preço individual de cada produto no pedido,
      // vamos considerar uma distribuição proporcional ao valor total
      const averagePrice = order.total / order.productIds.length;
      productSales[productIdStr].count += 1;
      productSales[productIdStr].totalAmount += averagePrice;
    }
  }

  return {
    dailySales,
    productSales,
  };
};

// Handler da função Lambda
exports.generateSalesReport = async (event, context) => {
  // Importante para evitar que a conexão fique aberta
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    // Obter a URI do MongoDB de uma variável de ambiente
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('A variável de ambiente MONGODB_URI não está definida');
    }

    // Conectar ao banco de dados
    const { Order } = await connectToDatabase(uri);

    // Definir o período do relatório (padrão: últimos 30 dias)
    // Usando 'let' em vez de 'const' para permitir reatribuições
    let endDate = new Date();
    let startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    // Permitir personalizar o período através dos parâmetros do evento
    if (event.body) {
      const body = JSON.parse(event.body);
      if (body.startDate) startDate = new Date(body.startDate);
      if (body.endDate) endDate = new Date(body.endDate);
    }

    // Buscar os pedidos no período especificado
    const orders = await Order.find({
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).populate('productIds');

    // Gerar o relatório de vendas
    const report = await generateSalesReport(orders);

    // Adicionar informações de resumo
    const totalOrderCount = Object.values(report.dailySales).reduce(
      (sum, day) => sum + day.orderCount,
      0,
    );

    const totalSalesAmount = Object.values(report.dailySales).reduce(
      (sum, day) => sum + day.totalAmount,
      0,
    );

    // Adicionar resumo ao relatório
    const summary = {
      period: {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      },
      totalOrders: totalOrderCount,
      totalSalesAmount,
      averageOrderValue:
        totalOrderCount > 0 ? totalSalesAmount / totalOrderCount : 0,
    };

    // Retornar o relatório completo
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summary,
        dailySales: report.dailySales,
        productSales: report.productSales,
      }),
    };
  } catch (error) {
    console.error('Erro ao gerar relatório de vendas:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Erro ao gerar relatório de vendas',
        error: error.message,
      }),
    };
  }
};
