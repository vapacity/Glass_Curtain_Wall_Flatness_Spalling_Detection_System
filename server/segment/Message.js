import { ElMessage } from 'element-plus'
/**
 * 定义message类型，以便在其它接口中直接使用。
 */
const showMessage = (msg, callback, type) => {
    ElMessage({
        type: type,
        message: msg,
        duration: 2000,
        onClose: () => {
            if (callback) {
                callback();
            }
        }
    })
}

const message = {
    error: (msg, callback) => {
        showMessage(msg, callback, "error");
    },
    success: (msg, callback) => {
        showMessage(msg, callback, "success");
    },
    warning: (msg, callback) => {
        showMessage(msg, callback, "warning");
    },
}

export default message;