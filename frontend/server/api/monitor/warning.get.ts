import axios from 'axios';
import { defineEventHandler } from 'h3';

const BASE_URL = 'http://111.231.168.12:8180/api/monitor';
/**
 * 接口名称：获取警告数据接口
 * 接口定义：此接口用于处理获取警告数据的请求。
 * 输入：
 *   - query: 从请求查询字符串中提取的参数，包含用于获取警告数据所需的过滤条件，数据类型为 object
 * 输出：
 *   - 在获取成功的情况下：
 *     - data: 包含警告数据的对象，数据类型为 object
 *   - 在获取失败的情况下：
 *     - error: 包含获取失败的原因，数据类型为 string
 */
export default defineEventHandler(async (event: any) => {
  try {
    // 提取请求参数
    const query = await getQuery(event)
    console.log('query: ', query)


    // 发起GET请求
    const response = await axios.get(`${BASE_URL}/warning`, { params: query });
    console.log('server',response);

    // 检查响应状态码
    if (response.status === 200) {
      // 历史数据获取成功
      console.log('api: response', response);
      return response.data;
    } else {
      // 获取历史数据失败
      throw new Error('Failed to get abnormal-data');
    }
  } catch (error: any) {
    // 设置状态码并返回错误信息
    event.res.statusCode = error.response?.status || 500;
    return { error: error.message };
  }
});