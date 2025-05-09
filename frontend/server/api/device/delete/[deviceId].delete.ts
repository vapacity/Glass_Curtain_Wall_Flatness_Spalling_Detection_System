import axios from 'axios';
import { defineEventHandler } from 'h3';

const BASE_URL = 'http://111.231.168.12:8180/api/device';
/**
 * 接口名称：删除设备接口
 * 接口定义：此接口用于处理删除指定设备的请求。
 * 输入：
 *   - deviceId: 从URL中提取的设备ID，用于标识要删除的设备。输入类型为 string
 * 输出：
 *   - 在删除成功的情况下：
 *     - success: true 表示删除成功，数据类型为 boolean
 *   - 在删除失败的情况下：
 *     - error: 包含删除失败的原因，数据类型为 string
 */
export default defineEventHandler(async (event) => {
    try {
        // 从URL中提取deviceId参数
        // const deviceId = event.context.params.deviceId;
        const deviceId = getRouterParam(event, 'deviceId')

        // 发起请求到原始设备API
        const response = await axios.delete(`${BASE_URL}/delete/${deviceId}`);

        // 返回成功消息
        return { success: true };
    } catch (error: any) {
        // 设置状态码并返回错误信息
        event.res.statusCode = error.response?.status || 500;
        return { error: error.message };
    }
});