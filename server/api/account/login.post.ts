import axios from "axios";
import { defineEventHandler, readBody } from "h3";

const BASE_URL = "http://111.231.168.12:8000/account";
/**
 * 接口名称：用户登录接口
 * 接口定义：此接口用于处理用户的登录请求，通过验证提供的电子邮件地址和密码来生成访问令牌。
 * 输入：
 *   - body: 请求体，包含用户的电子邮件（email）和密码（password）。
 *     - email: 用户的电子邮件地址，用于身份验证。
 *     - password: 用户的密码，用于身份验证。
 * 输出：
 *   - 在登录成功的情况下：
 *     - authToken: 认证令牌，用于后续请求的身份验证。
 *     - email: 用户的电子邮件地址。
 *   - 在登录失败的情况下：
 *     - error: 包含登录失败的原因。
 * 备注：该接口未被调用
 */
export default defineEventHandler(async (event: any) => {
  try {
    console.log("login");
    // 提取请求参数
    const body = await readBody(event);
    console.log("Received:", body);

    // 发起请求
    const response = await axios.post(`${BASE_URL}/login`, {
      username: body.email,
      password: body.password,
    });

    if (response.status === 200) {
      // 登陆成功，返回认证信息给客户端
      console.log("Login successful, token:", response.data.token);
      return {
        authToken: response.data.token,
        email: body.email,
      };
    } else {
      console.error("Login failed:", response);
      return {
        error: "Login failed with status: " + response.status,
      };
    }
  } catch (error: any) {
    // 设置状态码并返回错误信息
    event.res.statusCode = error.response?.status || 500;
    return { error: error.message };
  }
});
