import mongoose, { Document, Schema } from 'mongoose';

// Define TypeScript interfaces
interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  categoryIds: mongoose.Types.ObjectId[];
  imageUrl?: string;
}

interface IOrder extends Document {
  date: Date;
  productIds: mongoose.Types.ObjectId[];
  total: number;
}

interface DailySalesEntry {
  totalAmount: number;
  orderCount: number;
}

interface ProductSalesEntry {
  count: number;
  totalAmount: number;
}

interface SalesReport {
  dailySales: Record<string, DailySalesEntry>;
  productSales: Record<string, ProductSalesEntry>;
}

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
let Product: mongoose.Model<IProduct>;
let Order: mongoose.Model<IOrder>;

// Função para conectar ao MongoDB
const connectToDatabase = async (uri: string) => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions);

    // Inicializar modelos após a conexão
    Product = mongoose.model<IProduct>('Product', ProductSchema);
    Order = mongoose.model<IOrder>('Order', OrderSchema);
  }
  return {
    Product,
    Order,
  };
};

const createSalesReport = async (orders: IOrder[]): Promise<SalesReport> => {
  // Relatório diário
  const dailySales: Record<string, DailySalesEntry> = {};

  // Relatório por produto
  const productSales: Record<string, ProductSalesEntry> = {};

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
export const generateSalesReport = async (event: any, context: any) => {
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
    const report = await createSalesReport(orders); // Updated function name here

    // Adicionar informações de resumo
    const totalOrderCount = Object.values(report.dailySales).reduce(
      (sum, day: DailySalesEntry) => sum + day.orderCount,
      0,
    );

    const totalSalesAmount = Object.values(report.dailySales).reduce(
      (sum, day: DailySalesEntry) => sum + day.totalAmount,
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
  } catch (error: any) {
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
