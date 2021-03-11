<!--
 * @Author: weicong
 * @Date: 2021-03-10 10:30:01
 * @LastEditTime: 2021-03-11 16:42:01
 * @LastEditors: weicong
 * @Description: 
-->
<template>
  <div class="preview">
    <div class="preview-header">
      <Button @click="exportExcel">导出Excel</Button>
      <Button @click="exportImage">导出图片</Button>
      <Button @click="exportPDF">导出PDF</Button>
      <Button @click="exportDocx">导出DOC</Button>
      <Button @click="exportTXT(msg)">导出TXT</Button>
    </div>
    <div ref="preview">
      <Table :columns="columnsData" :data="rowsData"></Table>
    </div>
    <div class="preview-content">
      <div>预览效果</div>
      <iframe border="0" :src="fileUrl" v-if="fileType === 'iframe'"></iframe>
      <img :src="fileUrl" v-else />
    </div>
  </div>
</template>

<script>
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import html2canvas from "html2canvas";
import * as docx from "docx";
export default {
  name: "Preview",
  data() {
    return {
      exportName: "文件",
      fileUrl: "",
      fileType: "iframe",
      columnsData: [
        {
          title: "Name",
          key: "name",
        },
        {
          title: "Age",
          key: "age",
        },
        {
          title: "Address",
          key: "address",
        },
      ],
      rowsData: [
        {
          name: "John Brown",
          age: 18,
          address: "New York No. 1 Lake Park",
          date: "2016-10-03",
        },
        {
          name: "Jim Green",
          age: 24,
          address: "London No. 1 Lake Park",
          date: "2016-10-01",
        },
        {
          name: "Joe Black",
          age: 30,
          address: "Sydney No. 1 Lake Park",
          date: "2016-10-02",
        },
        {
          name: "Jon Snow",
          age: 26,
          address: "Ottawa No. 2 Lake Park",
          date: "2016-10-04",
        },
      ],
      msg: "hello world",
      bookType: "xlsx",
    };
  },
  methods: {
    exportExcel() {
      import("@/plugins/Export2Excel").then((excel) => {
        const tHeader = this.cutValue(this.columnsData, "title");
        const filterVal = this.cutValue(this.columnsData, "key");
        const list = this.rowsData;
        const data = this.formatJson(filterVal, list); // 格式化数据
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.exportName,
          autoWidth: true,
          bookType: this.bookType,
        });
      });
    },
    exportImage() {
      const dom = this.$refs.preview;
      html2canvas(dom, {
        backgroundColor: "#ffffff",
      }).then((canvas) => {
        // 地图需要使用html2canvas在转，然后绘制到dom上
        let dataUrl = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = this.exportName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        this.fileType = "image";
        this.fileUrl = dataUrl;
      });
    },
    exportPDF() {
      const dom = this.$refs.preview;
      html2canvas(dom, {
        backgroundColor: "#ffffff",
      }).then((canvas) => {
        // 地图需要使用html2canvas在转，然后使用img标签绘制到dom上
        let dataUrl = canvas.toDataURL("image/png");
        pdfMake.vfs = pdfFonts;
        pdfMake.fonts = {
          微软雅黑: {
            normal: "FZYTK.TTF",
            bold: "FZYTK.TTF",
            italics: "FZYTK.TTF",
          },
        };
        let docDefinition = {
          pageOrientation: "landscape",
          content: "测试",
          defaultStyle: {
            font: "微软雅黑",
          },
          background: [
            {
              image: dataUrl,
              width: 436.3,
              height: 450,
              alignment: "center",
              margin: [0, 60, 0, 0],
            },
          ],
        };
        const pdfDocGenerator = pdfMake.createPdf(docDefinition);
        pdfDocGenerator.download(this.exportName);
        pdfDocGenerator.getDataUrl((dataUrl) => {
          this.fileType = "iframe";
          this.fileUrl = dataUrl;
        });
      });
    },
    exportTXT(text) {
      const blob = new Blob([text]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = this.exportName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      this.fileType = "iframe";
      this.fileUrl = url;
    },
    exportDocx() {
      const dom = this.$refs.preview;
      html2canvas(dom, {
        backgroundColor: "#ffffff",
      }).then((canvas) => {
        // 地图需要使用html2canvas在转，然后使用img标签绘制到dom上
        let dataUrl = canvas.toDataURL("image/png");
        const img = new Image();
        img.src = dataUrl;
        img.onload = (e) => {
          let width = 1920,
            height = 231;
          if (e.target && e.target.naturalHeight && e.target.naturalWidth) {
            width = e.target.naturalWidth / 3;
            height = e.target.naturalHeight / 3;
          }
          const doc = new docx.Document();
          const Media = docx.Media;
          const Paragraph = docx.Paragraph;
          const TextRun = docx.TextRun;
          const image = Media.addImage(doc, dataUrl, width, height);
          doc.addSection({
            properties: {},
            children: [
              new Paragraph(image),
              new Paragraph({
                children: [new TextRun("Hello World")],
              }),
            ],
          });
          docx.Packer.toBlob(doc).then((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.style.display = "none";
            a.download = this.exportName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            document.body.removeChild(img);
          });
        };
        img.style.display = "none";
        document.body.appendChild(img);
      });
    },
    cutValue(target, name) {
      let arr = [];
      target.forEach((val) => {
        arr.push(val[name]);
      });
      return arr;
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          return v[j];
        })
      );
    },
  },
};
</script>

//
<style scoped lang="scss">
.preview {
  width: 100%;
  height: 100%;
  &-header {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 3rem;
  }
  &-content {
    font-size: 2rem;
    padding: 1rem;
    height: 35rem;
    & > div {
      display: inline-block;
      border-bottom: 3px solid blue;
    }
    iframe {
      display: block;
      border: 0;
      width: 100%;
      height: 100%;
      margin: 1rem;
    }
    img {
      width: 100%;
      height: 100%;
      margin: 1rem;
    }
  }
}
</style>
