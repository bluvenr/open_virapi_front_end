<template>
  <div class="v-code-editor-container" ref="v_code_container"></div>
</template>

<script>
///////////////////////////////////////////////
// 参考资料：
//
// 1. https://microsoft.github.io/monaco-editor/
// 2. https://zhuanlan.zhihu.com/p/47746336
// 3. https://github.com/matt-oconnell/vue-monaco-editor
///////////////////////////////////////////////

// 编辑器核心文件，按需引入语言支持文件
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import "monaco-editor/esm/vs/language/json/monaco.contribution";
import "monaco-editor/esm/vs/editor/contrib/find/findController.js";

export default {
  name: "monacoEditor",
  props: {
    options: {
      type: Object,
      default() {
        return {
          language: "plaintext", // json|plaintext
          readOnly: false // 是否只读
        };
      }
    },
    value: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      editor: null
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // 初始化编辑器实例
      if (this.options.language == "json") {
        monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
          // allowComments: true,   // 是否允许注释
          validate: true
        });
      }
      this.editor = monaco.editor.create(this.$refs["v_code_container"], {
        value: this.value,
        theme: "vs", // vs, hc-black, or vs-dark
        autoIndex: true,
        automaticLayout: true,
        minimap: {
          enabled: false
        },
        readOnly: false,
        ...this.options
      });

      // 监听编辑器content变化事件
      this.editor.onDidChangeModelContent(() => {
        // this.$refs.v_code_container.style.height = this.editor.getScrollHeight() + "px";
        this.$emit("contentChange", this.editor.getValue());
      });

      // 监听编辑器失去输入焦点事件
      this.editor.onDidBlurEditorWidget(() => {
        this.$emit("blur");
      });

      // this.editor.focus();   // 自动获得焦点
    },
    changeSampleByLanguageRedraw(language) {
      var oldModel = this.editor.getModel();
      var newModel = monaco.editor.createModel(
        this.value,
        language ? language : this.options.language
      );
      this.editor.setModel(newModel);
      if (oldModel) {
        oldModel.dispose();
      }
    },
    setEditorValue(value) {
      this.editor.setValue(value);
    }
  },
  destroyed() {
    if (this.editor) {
      this.editor.dispose();
    }
  }
};
</script>

<style lang="less" scope>
.v-code-editor-container {
  .monaco-editor .scroll-decoration {
    box-shadow: none;
  }
}
</style>