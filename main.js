const {
  ipcRenderer
} = require('electron');
const version = document.getElementById('version');
const notification = document.getElementById('notification');
const message = document.getElementById('message');
const progress = document.getElementById('progress');
const restartButton = document.getElementById('restart-button');
const contentTab = document.getElementById('content-tab');
const navigationTab = document.getElementById('navbar-nav');
const rootDir = document.getElementById('root-dir');
const DomParser = require('dom-parser');
const fs = require('fs');
const axios = require("axios");
const Jimp = require('jimp');
// const key = 'https://b18072e368d0363d247c5b773a8a327e:2e3873924e3346244cdb68ec30539472@unifury.myshopify.com/admin/orders.json?name=';
var imagesInDir = '';
var staticPath = '';
var myInstalledDir = '';
var thisItem = '';
const genart5 = `<div class="container" style="margin-left: 0px;margin-top: 10px;padding-right: 0px;">
    <div class="row">
        <div class="col-md-6" style="padding-left: 0px;padding-right: 0px;">
          <form>
            <section class="fieldset">
            <h1>Dữ liệu</h1>
            <div class="row">
              <div class="col-md-12">
              <div class="input-group">
                <input type="text" class="form-control" id="input_sync_order" placeholder="Url Data dowload" aria-label="Recipient's username" aria-describedby="basic-addon2">
                  <div class="input-group-append">
                    <button class="btn btn-outline-secondary" type="button" id="sync_order">Lấy Data<i id="spin-sync" class="spinner-border spinner-border-sm hidden"></i></button>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12" style="margin-top: 4px;">
                <div class="input-group">
                  <input type="text" class="form-control" placeholder="Id Folder" id="input_parent" value="">
                  <input type="text" class="form-control" id="input_file_id" placeholder="Id File" value="">
                  <div class="input-group-append">
                    <button class="btn btn-outline-secondary" type="button" id="btn_get_background">Là Background<i id="spin-sync-bg" class="spinner-border spinner-border-sm hidden"></i></button>
                    <button class="btn btn-outline-secondary" type="button" id="btn_get_image">Là Data<i id="spin-sync-img" class="spinner-border spinner-border-sm hidden"></i></button>
                    <button class="btn btn-outline-secondary" type="button" id="btn_get_mockup">Là Mockup<i id="spin-sync-mockup" class="spinner-border spinner-border-sm hidden"></i></button>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="input-group">
                <div class="custom-file">
                  <input type="file" class="custom-file-input" id="input_file" onchange="importBackgroud()">
                  <label class="custom-file-label" for="inputGroupFile04">Choose file</label>
                </div>
              </div>
            </div> 
            </section>
          </form>
        </div>
        <div class="col-md-6">
          <section class="fieldset">
          <h1>Thao tác</h1>
          <div class="btn-group" role="group" aria-label="Basic example">
            <button class="btn btn-outline-secondary" id="build_art_order">In file<i id="spin-build" class="spinner-border spinner-border-sm hidden"></i></button>
            <button class="btn btn-outline-secondary" id="edit_art_with_mockup">Edit File với Mockup</button>
            <button class="btn btn-outline-secondary" id="duplicate_art">Duplicate File</button>
            <button class="btn btn-outline-secondary" id="build_art_with_mockup">In File + Mockup</button>
            <button class="btn btn-outline-warning" onclick="reloadApp()" id="build_art_order">Reload Tool</button>
          </div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-8" style="padding-left: 0px;padding-right: 0px;">    
          <div id="content-genart"></div>
        </div>
        <div class="col-md-2" style="margin-top: 10px;padding-right: 2px;padding-left: 2px;">
          <section class="fieldset">
            <h1>Layers</h1>
            <div id="layers"></div>
          </section>
        </div>
        <div class="col-md-2" style="margin-top: 10px;padding-left: 0px;">
          <section class="fieldset">
            <h1>Thông tin Order</h1>
            <div id="properties"></div>
          </section>
        </div>
    </div></div>`;
var list_images = '';
const tip = `<br>
            <p>Đây là mục hướng dẫn</p>

            <div class="tab">
              <button class="tablinks" onclick="openCity(event, 'B1')">Bước 1</button>
              <button class="tablinks" onclick="openCity(event, 'B2')">Bước 2</button>
              <button class="tablinks" onclick="openCity(event, 'CN')">Chức Năng</button>
            </div>

            <div id="B1" class="tabcontent">
              <h3>Bước 1</h3>
              <p>Chọn Công cụ. Dán url data dowload vào ô nhập liệu, sau đó click Lấy Data</p>
              <img src="../src/images/1.png" alt="" style="width: 100%;height: 350px;border: 1px solid black;">
              <p>Cách lấy link url </p>
              <img src="../src/images/2.png" alt="" style="width: 100%;height: 350px;border: 1px solid black;">
              <p>Ví dụ : <a href="http://ft.mmocare.com/shopify/sku/calculate-data-image?itemId=609343">http://ft.mmocare.com/shopify/sku/calculate-data-image?itemId=609343</a></p>
            </div>

            <div id="B2" class="tabcontent">
              <h3>Bước 2</h3>
              <p>Sau khi lấy data chọn import Background và thực hiện kéo thả</p> 
              <img src="../src/images/2.png" alt="" style="width: 100%;height: 350px;border: 1px solid black;">
              <p>Sau khi kéo thả ấn chuột phải vào icon set background</p>
              <img src="../src/images/3.png" alt="" style="width: 100%;height: 350px;border: 1px solid black;">
              <p>Chọn In file sau khi đã hoàn thành việc ghép ảnh</p>
              <p>Xem vị trí lưu ảnh trên thông báo</p>
              <p>Ấn Làm mới để tiếp tục với ORDER khác. KẾT THÚC</p>
            </div>

            <div id="CN" class="tabcontent" style="position: relative;">
              <h3>Chức Năng</h3>
              <p>Lật<span class="mdi mdi-flip-horizontal" style="position: absolute;z-index: 1;top: 46px;left: 150px;"></span></p>
              <p>Xoay<span class="mdi mdi-arrow-left" style="position: absolute;z-index: 1;top: 86px;left: 160px;"></span><span class="mdi mdi-arrow-right" style="position: absolute;z-index: 1;top: 86px;left: 176px;"></span></p>
              <p>Layer<span class="mdi mdi-clipboard-flow" style="position: absolute;z-index: 1;top: 168px;left: 190px;"></span></p>
            </div>`;
const colors = ['black', '#ea0b20', '#ffc800', '#14d24e', '#39eada', '#b25ae8', '#b25ae8', '#68d2fb', '#68a3fb', '#7868fb', '#de68fb', '#fb68e2', '#fb689e', 'black'];
parseNum = str => +str.replace(/[^.\d]/g, '');
// AUTO UPDATE

ipcRenderer.send('app_version');
// ipcRenderer.send('getPath_app');
ipcRenderer.send('getPath_root');

ipcRenderer.on('getPath_app', (event, arg) => {
  ipcRenderer.removeAllListeners('getPath_app');

  staticPath = arg.path + '/src/images/';
  // staticPath = '/Applications/spalms.app/Contents/Resources/app.asar/src/images/';
  if (staticPath.search("app.asar")) {
    // is Pro
    staticPath = staticPath.replace('app.asar/src/', '');

    if (!fs.existsSync(staticPath)) {
      console.log('The path ' + staticPath + ' not exists. mkdir new !');

      fs.mkdirSync(staticPath);

      if (fs.existsSync(staticPath)) {
        console.log(staticPath + ' mkdir success !');
      }
    }
  }

  console.log('ROOT ', staticPath);
  // rootDir.innerText = staticPath;
});

ipcRenderer.on('getPath_root', (event, arg) => {
  ipcRenderer.removeAllListeners('getPath_root');
  myInstalledDir = arg.path;
  // staticPath = arg.path

  // staticPath = arg.path+'/images/';

  // if (staticPath.search("app.asar")) {
  //   // is Pro
  //   staticPath = staticPath.replace('app.asar/src/', '');

  //   if (!fs.existsSync(staticPath)) {
  //     console.log('The path '+staticPath+' not exists. mkdir new !');

  //     fs.mkdirSync(staticPath);

  //     if (fs.existsSync(staticPath)) {
  //       console.log(staticPath+' mkdir success !');
  //     }
  //   } 
  // }

  // console.log('StaticPath: '+staticPath);
  console.log('InstalledPath: ' + myInstalledDir);
});

ipcRenderer.on('app_version', (event, arg) => {
  ipcRenderer.removeAllListeners('app_version');
  version.innerText = 'Version ' + arg.version;
});

ipcRenderer.on('update_available', () => {
  ipcRenderer.removeAllListeners('update_available');
  message.innerText = 'Vui lòng k tắt ứng dụng để tránh lỗi. Downloading now...';
  console.log('A new update is available. Downloading now...');
  notification.classList.remove('hidden');
});

ipcRenderer.on('update_downloaded', () => {
  ipcRenderer.removeAllListeners('update_downloaded');
  message.innerText = 'Update Downloaded. It will be installed on restart. Restart now?';
  ipcRenderer.removeAllListeners('update-progress');
  restartButton.classList.remove('hidden');
  notification.classList.remove('hidden');
});

ipcRenderer.on('update-progress', (event, arg) => {
  progress.style.width = `${arg.progress}%`;
  progress.innerHTML = `${arg.progress}%`;
});

function closeNotification() {
  notification.classList.add('hidden');
}

function restartApp() {
  ipcRenderer.send('restart_app');
}

function reloadApp() {
  window.location.reload(true);
}
// ------------- DECLARE OBJECT
const NavigationTab = {
  createNavigation: function () {
    return `<li class="nav-item" data-html="${this.htmlFile}"><a class="nav-link"><i class="${this.icon}"></i>${this.name}</a></li>`;
  },

};

// ------------- FUNCTION MAIN


function navigationEventCreate() {
  const genart = Object.create(NavigationTab);
  genart.name = ' Công cụ';
  genart.icon = 'mdi mdi-tools';
  genart.htmlFile = 'genart5.html';
  navigationTab.innerHTML = genart.createNavigation();

  const tip = Object.create(NavigationTab);
  tip.name = ' Hướng dẫn';
  tip.icon = 'mdi mdi-information';
  tip.htmlFile = 'tip.html';
  navigationTab.innerHTML += tip.createNavigation();

  const help = Object.create(NavigationTab);
  help.name = ' Trợ giúp';
  help.icon = 'mdi mdi-help-circle';
  help.htmlFile = 'help.html';
  navigationTab.innerHTML += help.createNavigation();

  const setting = Object.create(NavigationTab);
  setting.name = ' Cài đặt';
  setting.icon = 'mdi mdi-cog-outline';
  setting.htmlFile = 'setting.html';
  navigationTab.innerHTML += setting.createNavigation();
}

function navigationEventClick() {
  let navItem = navigationTab.querySelectorAll('.nav-item');
  let url = '';

  for (var i = 0; i < navItem.length; i++) {
    navItem[i].addEventListener('click', function (event) {
      if (thisItem == '') {
        thisItem = this;
        thisItem.classList.add('active-nav');
      } else {
        thisItem.classList.remove('active-nav');
        thisItem = this;
        thisItem.classList.add('active-nav');
      }

      url = thisItem.getAttribute("data-html");

      if (url == 'genart5.html') {
        contentTab.innerHTML = genart5;
        let build_art_order = document.getElementById('build_art_order');
        // let btn_sync_order = document.getElementById('sync_order');
        let input_sync_order = document.getElementById('input_sync_order');
        // let div_properties = document.getElementById('properties');
        // let property = '<p>Properties</p>';
        // selectAllWithMouse();
        build_art_order.addEventListener('click', function () {
          build_art_order.childNodes[1].classList.remove('hidden');
          setBackground(document.getElementById('input_sync_order').value, build_art_order.childNodes[1], 1);
        });

        document.getElementById('sync_order').addEventListener('click', function (e) {
          e.preventDefault();
          document.getElementById('spin-sync').classList.remove('hidden');

          if (input_sync_order.value.length <= 8) { // nếu nhập order
            // getProperties('', '');
            imageEventCreate(input_sync_order.value);
          } else {
            imageEventCreate(input_sync_order.value);
          }

        });

        document.getElementById('btn_get_background').addEventListener('click', function (e) {
          e.preventDefault();
          if (input_sync_order.value.length > 0) {
            document.getElementById('spin-sync-bg').classList.remove('hidden');
            let file_id = document.getElementById('input_file_id').value;
            let parent_id = document.getElementById('input_parent').value;
            console.log('c');
            urlToImage(file_id, parent_id, false);
          } else {
            alert('Cần lấy data order trước, Background hãy import cuối cùng!');
          }
        });

        document.getElementById('btn_get_image').addEventListener('click', function (e) {
          e.preventDefault();
          document.getElementById('spin-sync-img').classList.remove('hidden');
          let file_id = document.getElementById('input_file_id').value;
          let parent_id = document.getElementById('input_parent').value;

          urlToImage(file_id, parent_id, false);
        });

        document.getElementById('btn_get_mockup').addEventListener('click', function (e) {
          e.preventDefault();
          let file_id = document.getElementById('input_file_id').value;
          let parent_id = document.getElementById('input_parent').value;
          // document.getElementById('spin-sync-img').classList.remove('hidden');
          urlToImage(file_id, parent_id, true);
        });

        document.getElementById('edit_art_with_mockup').addEventListener('click', function (e) {
          e.preventDefault();
          setBackground(document.getElementById('input_sync_order').value, build_art_order.childNodes[1], 2);
        });
      } else if (url == 'tip.html') {
        contentTab.innerHTML = tip;
      }

    });
  }
}

function setBackground(order = '', spiner, btn) {
  let countToWrite = 0;
  let thisBackground = '';
  let rotate = 0;
  let left = 0;
  let top = 0;

  let width = 0;
  let height = 0;
  const images = document.querySelectorAll(".item");

  if (images.length > 0) {
    for (let i = 0; i < images.length; i++) {
      checkBackGround(images[i].style.zIndex, function (isBackGround) {
        if (isBackGround) {

          thisBackground = images[i].childNodes[1].src;

          if (thisBackground.search(',') != -1) { //Background LÀ BASE64 thì phải đổi về buffer

            base64ToBuffer(images[i].childNodes[1].src.slice(22), function (background) {
              setLayers(images, function (newImages) {
                let objectItems = Object.assign({}, newImages);

                buildArt(background, newImages, objectItems, countToWrite, i, order, left, top, width, height, rotate, btn);
              });
            });

          } else {

            thisBackground = images[i].childNodes[1].src;
            setLayers(images, function (newImages) {
              let objectItems = Object.assign({}, newImages);
              buildArt(thisBackground.slice(7), newImages, objectItems, countToWrite, i, order, left, top, width, height, rotate, btn);
            });

          }

        } else {
          if (i == images.length - 1) {
            alert('K tìm thấy background');
            spiner.classList.add('hidden');
          }
        }

      });
    }

  } else {
    alert('Chưa có dữ liệu để in');
    spiner.classList.add('hidden');
  }
}

function setLayers(images, callback) {
  let position = [];
  let newImage = [];

  for (var i = 0; i < images.length - 1; i++) {
    position.push(images[i].style.zIndex);
  }

  for (var i = 0; i < position.length - 1; i++) {
    for (var j = 1; j < position.length; j++) {
      if (position[i] > position[j]) {
        let temp = position[j];
        position[j] = position[i];
        position[i] = temp;
      }
    }
  }

  for (var i = 0; i <= position.length - 1; i++) {
    for (var j = 0; j < images.length - 1; j++) {
      if (position[i] == images[j].style.zIndex) {
        newImage.push(images[j]);
      }
    }
  }

  callback(newImage);
}

function imageEventCreate(order) {
  // START GET IMAGE URL
  let div_properties = document.getElementById('properties');

  if (order.length > 7) {
    console.log(`Lấy dữ liệu từ ${order}`);
    let token = Buffer.from(`palm:OARPQYF1vK`, 'utf8').toString('base64')
    axios.get(
        order, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Content-Type': 'application/x-www-form-urlencoded",
            'Authorization': `Basic ${token}`,
          }
        },
      )
      .then((response) => {
          if (response) {
            if (response.request.responseURL == 'http://ft.mmocare.com/site/login') {
              processLogin(function (url) {
                if (url) {
                  console.log('Thực hiện lấy dữ liệu');
                  buildAxiosGetArtUrl(order);
                } else {
                  alert('Đăng nhập FT thất bại');
                }
              });
            } else {
              console.log('Lấy dữ liệu thành công, dựng thành ảnh');
              let parser = new DomParser();
              let dom = parser.parseFromString(response.data);
              let imgs_url = dom.getElementsByClassName('result-img');
              let labels = dom.getElementsByClassName('label-info');
              getProperties(0, dom.getElementsByClassName('col-sm-3')); //lấy properti ở đây

              let imgs_list_url = [];

              try {
                for (var i = 0; i < imgs_url.length; i++) {
                  imgs_list_url.push('http://ft.mmocare.com' + imgs_url[i].attributes[2].value);

                  if (i == imgs_url.length - 1) {
                    processConvertUrlToImage(imgs_list_url);
                  }
                }
              } catch (error) {
                console.log(error);
              }
            }
          }
        },
        (error) => {
          console.log(error.response);
          alert('Lỗi từ FT, có thể là đơn PA', error.response.status);
        }
      );
  } else {
    myInstalledDir = myInstalledDir + '/' + order + '/';

    if (!fs.existsSync(myInstalledDir)) {
      console.log('Tạo folder order ' + myInstalledDir + ' !');

      fs.mkdirSync(myInstalledDir);

      if (fs.existsSync(myInstalledDir)) {
        console.log(myInstalledDir + ' Tạo thành công !');
      }
    } else {
      console.log('Đã có sẵn folder ' + myInstalledDir + ' !');
    }

    imagesInDir = fs.readdirSync(myInstalledDir);

    processConvertUrlFolderToImage(imagesInDir, myInstalledDir);
  }

  myInstalledDir = myInstalledDir.replace(order + '/', '');
}

// async function textToBase64(properties, callback) { // tạm thời k dùng
//   let f = new FontFace('sunvalley1', 'url("../src/SunValley.ttf")');
//   let a = await f.load();
//   document.fonts.add(f);

//   for await (let pro of properties) {
//     if (pro.name.search('Name') != -1) {
//       console.log(pro.value);
//       let canvas = document.createElement('canvas');
//       let ctx = canvas.getContext("2d");
//       ctx.font = "80px sunvalley1";
//       ctx.fillStyle = "white";
//       ctx.textAlign = "center";
//       ctx.fillText(pro.value, 0, 30);
//       let b = await canvas.toDataURL();
//       callback(b);
//     }
//   }
// }

async function processConvertUrlFolderToImage(imagesInDir, staticPath = '') {
  let contentGenArt = document.getElementById("content-genart");
  let left = 0;
  let top = 0;
  for (var i = 0; i < imagesInDir.length; i++) {

    readImageFolder(staticPath + imagesInDir[i], function (base64) {
      setDimension(base64, function (width, height) {
        // list_images += urlToArtHtml(base64, i, width, height, left, top, i, false);
        contentGenArt.insertAdjacentHTML('beforeend', urlToArtHtml(base64, i, width, height, left, top, i, false));

        if (i == imagesInDir.length) {
          // contentGenArt.innerHTML = list_images;
          document.getElementById('spin-sync').classList.add('hidden');
          processArt();
        }

        left = left + 70;
      })
    });

  }
}

function setDimension(base64, callback) {
  var image = new Image();
  image.onload = function () {
    callback(image.width / 8, image.height / 8);
  };

  image.src = base64;
}

function getOrderInfo(labels, callback) {
  let title = ['#Campaign: ', '#Order Id: ', '#File Name: ', '#Dimesion key: ', '#Dimesion: ', '#Variant Title: '];
  let property = '<p>Order info</p>';

  for (var i = 0; i < labels.length; i++) {
    property += `
    <small>` + title[i] + `</small>
    <small>` + labels[i].childNodes[0].text + `</small><br>`;
  }

  callback(property);
}

async function getProperties(order = '', html) {
  // let url = key+order+"&status=any";
  let div_properties = document.getElementById('properties');
  let property = '';
  let zIndex = 20;
  let color = 1;
  let contentGenArt = document.getElementById("content-genart");
  let canvas = '';
  let ar = [];
  let left = 50;
  let f = new FontFace('sunvalley1', 'url("../src/SunValley.ttf")');
  let a = await f.load();
  document.fonts.add(f);

  html = html[1].childNodes;

  for (let i = 0; i < html.length; i++) {
    if (html[i].nodeName == 'b') {
      if (html[i].childNodes[0].text.search('Name') != -1) {
        ar.push(html[i + 1].childNodes[0].text);
      }

      property +=
        '<div class="line-proper">' +
        '<small class="property-name">' + html[i].childNodes[0].text + '</small>';
    } else if (html[i].nodeName == 'span') {
      if (html[i].childNodes[0] == undefined) {
        property +=
          '<small class="property-value"></small>' +
          '</div>';
      } else {
        if (html[i - 1].childNodes[0].text.search('Name') != -1) {
          property +=
            '<small class="property-value-name">' + html[i].childNodes[0].text + '</small>' +
            '</div>';
        } else {
          property +=
            '<small class="property-value">' + html[i].childNodes[0].text + '</small>' +
            '</div>';
        }
      }
    }

    if (i == html.length - 1) {
      for await (let a of ar) {
        canvas = document.createElement('canvas');
        let ctx = canvas.getContext("2d");
        ctx.font = "120px sunvalley1";
        ctx.fillStyle = "white";
        ctx.fillText(a, 0, 110);
        let b = await canvas.toDataURL();
        contentGenArt.insertAdjacentHTML('beforeend', urlToArtHtml(b, zIndex, 100, 53, left, 150, color, false));
        zIndex = zIndex + 1;
        color = color + 1;
        left = left + 100;
      }

      div_properties.innerHTML = property;
    }
  }

  // property += '<small style="color:red;font-family: monospace;font-size: 13px;">#'+order+'</small>';
  // axios.get(url).then((data) => {
  //     for (var i = 0; i < data.data.orders[0].line_items[0].properties.length; i++) {
  //         property +=
  //         '<div class="line-proper">'+
  //         '<small class="property-name">'+data.data.orders[0].line_items[0].properties[i].name+'</small>'+
  //         '<small class="property-value">'+data.data.orders[0].line_items[0].properties[i].value+'</small>'+
  //         '</div>';
  //     }

  //     div_properties.innerHTML += property;

  //     textToBase64(data.data.orders[0].line_items[0].properties, function (base64) {
  //       contentGenArt.insertAdjacentHTML('beforeend', urlToArtHtml(base64, zIndex, 120, 35, 0, color, false));
  //       zIndex = zIndex+1;
  //       color = color+1;
  //     });
  // });
}

async function processConvertUrlToImage(imgs_list_url) {
  let contentGenArt = document.getElementById("content-genart");
  let left = 50;
  let top = 50;

  for (var i = 0; i < imgs_list_url.length; i++) {

    let url = await processGenArt(imgs_list_url[i]);
    blobToBase64(url)
      .then(base64String => {

        getPngDimensions(base64String.slice(22), function (width, height) {
          contentGenArt.insertAdjacentHTML('beforeend', urlToArtHtml(base64String, i, width / 2, height / 2, left, top, i, false));

          if (i == imgs_list_url.length) {
            processArt();
            document.getElementById('spin-sync').classList.add('hidden');
          }

          left = left + 70;
        });

      });
  }
}

function getPngDimensions(base64, callback) {
  const header = atob(base64.slice(0, 50)).slice(16, 24)
  const uint8 = Uint8Array.from(header, c => c.charCodeAt(0))
  const dataView = new DataView(uint8.buffer)
  callback(dataView.getInt32(0), dataView.getInt32(4));
}

async function blobToBase64(blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

function urlToArtHtml(url, zIndex, width, height, left, top, color, isBackground) {
  let icon = '';
  let bg = '';
  // <i class="mdi mdi-rotate-3d-variant" style="position: absolute;left: 0px;top: -50px;"></i>

  color = `border: 1px dashed ${colors[color]};`;

  width = width.toString().split(".")[0];
  height = height.toString().split(".")[0];

  if (isBackground) {
    color = '';
  } else {

    if (width >= 130 && height >= 40 && width < 150) { // is Text
      icon = '<i class="mdi mdi-clipboard-flow"></i>';
      bg = '<i class="mdi mdi-arrow-left"></i><i class="mdi mdi-arrow-right"></i>';
    } else { // is Element
      icon = '<i class="mdi mdi-clipboard-flow"></i><i class="mdi mdi-flip-horizontal"></i>';
      bg = '<i class="mdi mdi-arrow-left"></i><i class="mdi mdi-arrow-right"></i>';
    }

  }

  let html = `<div class="item" style="top:${top}px;left:${left}px;z-index:` + (zIndex + 1) + `;width: ${width}px;height: ${height}px;transform:rotate(0deg)">
         <img src="` + url + `" draggable="false" style="width: ${width}px;height: ${height}px;${color}">
         <div class="resizer ne">
         ${bg}
         </div>
         <div class="resizer nw">
         ${icon}
         </div>
         <div class="resizer sw"><span>Width: ${width} & Height: ${height} </span><span>Layer:` + (zIndex + 1) + ` </span></div>
         <div class="resizer se"></div>
      </div>`;

  return html
}

function buildAxiosGetArtUrl(order) {
  let div_properties = document.getElementById('properties');
  console.log(`Call url ${order} and get Data`);
  let token = Buffer.from(`palm:OARPQYF1vK`, 'utf8').toString('base64')
  axios.get(
      order, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-type": "Content-Type': 'application/x-www-form-urlencoded",
          'Authorization': `Basic ${token}`,
        }
      },
    )
    .then((response) => {
        if (response) {
          let parser = new DomParser();
          let dom = parser.parseFromString(response.data);
          let imgs_url = dom.getElementsByClassName('result-img');
          let labels = dom.getElementsByClassName('label-info');
          //order = labels[1].childNodes[0].text
          getProperties(0, dom.getElementsByClassName('col-sm-3'));
          let imgs_list_url = [];

          try {
            for (var i = 0; i < imgs_url.length; i++) {
              imgs_list_url.push('http://ft.mmocare.com' + imgs_url[i].attributes[2].value);

              if (i == imgs_url.length - 1) {
                processConvertUrlToImage(imgs_list_url);
              }
            }
          } catch (error) {
            console.log(error);
          }
        }
      },
      (error) => {
        console.log(error.response);
      }
    );
}

async function processGenArt(url) {
  let response = await fetch(url, {
    "headers": {
      // "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      // "accept-language": "en-US,en;q=0.9,vi;q=0.8",
      "Content-type": "image/png",
      "authorization": "Basic cGFsbTpPQVJQUVlGMXZL",
      "cache-control": "no-cache",
    },
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": null,
    "method": "GET",
    // "mode": "cors"
  })

  url = response.blob();
  return url
}

function processArt() {
  // Process Drag Drop
  const items = document.querySelectorAll(".item");
  let isResizing = false;

  for (let item of items) {
    item.addEventListener("mousedown", mousedown, false);
  }

  function mousedown(e) {
    window.addEventListener("mousemove", mousemove);
    window.addEventListener("mouseup", mouseup);
    let $this = e.target.parentNode;

    let prevX = e.clientX;
    let prevY = e.clientY;

    let prevLeft = parseInt($this.style.left.replace("px", ""));
    let prevTop = parseInt($this.style.top.replace("px", ""));

    function mousemove(e) {
      if (!isResizing) {
        const rect = e.target.getBoundingClientRect()

        $this.style.left = (rect.left - rect.left + prevLeft) - (prevX - e.clientX) + "px";
        $this.style.top = (rect.top - rect.top + prevTop) - (prevY - e.clientY) + "px";
      }
    }

    function mouseup() {
      window.removeEventListener("mousemove", mousemove);
      window.removeEventListener("mouseup", mouseup);
    }
  }

  // Process Resize Object
  const resizers = document.querySelectorAll(".resizer");
  let currentResizer;

  for (let resizer of resizers) {
    resizer.addEventListener("mousedown", mousedown);

    function mousedown(e) {
      currentResizer = e.target;

      let thisImage = currentResizer.parentNode.parentNode;

      if (e.target.getAttribute("class") == 'mdi mdi-clipboard-flow') {
        thisImage.style.zIndex = parseInt(thisImage.style.zIndex) + 1;
        currentResizer.parentNode.nextElementSibling.childNodes[1].innerHTML = 'Layer: ' + thisImage.style.zIndex;
      } else if (e.target.getAttribute("class") == 'mdi mdi-image-frame') {
        // thisImage.style.top = 0;
        // thisImage.style.left = 0;
        // thisImage.style.zIndex = 0;
        // alert('Hoàn thành chọn background');
      } else if (e.target.getAttribute("class") == 'mdi mdi-flip-horizontal') {

        thisImage = currentResizer.parentNode.previousElementSibling.previousElementSibling;
        let thisUrlText = thisImage.src.slice(7);

        if (thisImage.src.search(',') != -1) { // NẾU SRC ĐANG LÀ BASE64 thì phải đổi về buffer
          base64ToBuffer(thisImage.src.slice(22), function (thisUrlTextNew) {

            processFlipArt(thisUrlTextNew, function (base64) {
              thisImage.src = 'data:image/png;base64,' + base64;
            });

          });

        } else {
          processFlipArt(thisUrlText, function (base64) {
            thisImage.src = 'data:image/png;base64,' + base64;
          });
        }

      }

      if (currentResizer.classList.contains("mdi-arrow-right")) {
        currentResizer.parentNode.parentNode.style.transform = "rotate(" + (parseNum(currentResizer.parentNode.parentNode.style.transform) + 1) + "deg)";
      } else if (currentResizer.classList.contains("mdi-arrow-left")) {
        if (parseNum(currentResizer.parentNode.parentNode.style.transform) == 0) {
          currentResizer.parentNode.parentNode.style.transform = "rotate(360deg)";
        }
        currentResizer.parentNode.parentNode.style.transform = "rotate(" + (parseNum(currentResizer.parentNode.parentNode.style.transform) - 1) + "deg)";
      }

      isResizing = true;

      let prevX = e.clientX;
      let prevY = e.clientY;

      window.addEventListener("mousemove", mousemove);
      window.addEventListener("mouseup", mouseup);
      window.paramEl = resizer.parentElement;

      function mousemove(e) {
        let el = e.currentTarget.paramEl;
        const rect = el.getBoundingClientRect();


        if (currentResizer.classList.contains("se")) {
          if (rect.width >= 20) { // nhỏ hơn 20 k cho resize 

            if (prevX - e.clientX != 0) {
              el.style.width = rect.width - (prevX - e.clientX) + "px";
              el.style.height = rect.height - (prevX - e.clientX) + "px";
              el.children[0].style.width = rect.width - (prevX - e.clientX) + "px";
              el.children[0].style.height = rect.height - (prevX - e.clientX) + "px";
            } else if (prevY - e.clientY != 0) {
              el.style.width = rect.width - (prevY - e.clientY) + "px";
              el.style.height = rect.height - (prevY - e.clientY) + "px";
              el.children[0].style.width = rect.width - (prevY - e.clientY) + "px";
              el.children[0].style.height = rect.height - (prevY - e.clientY) + "px";
            } else if (prevX - e.clientX && prevY - e.clientY != 0) {
              if (prevX - e.clientX > prevY - e.clientY) {
                el.style.width = rect.width - (prevY - e.clientY) + "px";
                el.style.height = rect.height - (prevY - e.clientY) + "px";
                el.children[0].style.width = rect.width - (prevY - e.clientY) + "px";
                el.children[0].style.height = rect.height - (prevY - e.clientY) + "px";
              } else {
                el.style.width = rect.width - (prevX - e.clientX) + "px";
                el.style.height = rect.height - (prevX - e.clientX) + "px";
                el.children[0].style.width = rect.width - (prevX - e.clientX) + "px";
                el.children[0].style.height = rect.height - (prevX - e.clientX) + "px";
              }
            }
          }
          // el.style.width = rect.width - (prevX - e.clientX) + "px";
          // el.style.height = rect.height - (prevY - e.clientY) + "px";
          // el.children[0].style.width = rect.width - (prevX - e.clientX) + "px";
          // el.children[0].style.height = rect.height - (prevY - e.clientY) + "px";
          // el.children[3].innerHTML = 'Width: '+h.toString().split(".")[0]+' & Height: '+h.toString().split(".")[0];
        } //else if (currentResizer.classList.contains("ne")) {
        // el.children[0].style.transform = "rotate("+(prevX - e.clientX)+"deg)";
        //} //else if (currentResizer.classList.contains("sw")) {
        //     el.style.width = rect.width - (prevX - e.clientX) + "px";
        //     el.style.height = rect.height + (prevY - e.clientY) + "px";
        //     el.style.top = rect.top - (prevY - e.clientY) + "px";
        // } else {
        //     el.style.width = rect.width + (prevX - e.clientX) + "px";
        //     el.style.height = rect.height + (prevY - e.clientY) + "px";
        //     el.style.top = rect.top - (prevY - e.clientY) + "px";
        //     el.style.left = rect.left - (prevX - e.clientX) + "px";
        // }
        prevX = e.clientX;
        prevY = e.clientY;
      }

      function mouseup() {
        window.removeEventListener("mousemove", mousemove);
        window.removeEventListener("mouseup", mouseup);
        isResizing = false;
      }
    }
  }

  // Process Select All Object
  const background = document.getElementById("content-genart");
  background.addEventListener("mousedown", mousedown2, false);

  function mousedown2(e) {
    if (e.target.getAttribute("id") == 'content-genart') {
      if (window.selectItem != undefined) {
        background.removeChild(window.selectItem);
        window.selectItem = undefined;
      }
      let selectBorder = document.createElement("div");
      background.append(selectBorder);
      selectBorder.style.display = 'block';
      let prevX = e.clientX;
      let prevY = e.clientY;
      let rect = e.target.getBoundingClientRect();

      background.lastChild.style.left = e.clientX - 246 + 'px';
      background.lastChild.style.top = e.clientY - 150 + 'px';

      selectBorder.className = "select-border";

      window.addEventListener("mousemove", mousemove2);
      window.addEventListener("mouseup", mouseup2);

      function mousemove2(e) {
        selectBorder.style.width = 0 - (prevX - e.clientX) + 'px';
        selectBorder.style.height = 0 - (prevY - e.clientY) + 'px';
      }

      async function mouseup2() {
        let b = await calculateSelectItem(background.lastChild.style.left, background.lastChild.style.top, selectBorder.style.width, selectBorder.style.height, items);

        if (!b.select) {
          background.removeChild(background.lastChild);
        } else {
          window.selectItem = background.lastChild;
          moveSelectItem(b.newItems);
        }

        // console.log(window.selectItem);
        window.removeEventListener("mousemove", mousemove2);
        window.removeEventListener("mouseup", mouseup2);
      }
    }

  }
}

async function calculateSelectItem(left, top, width, height, items) {
  left = parseInt(left.replace("px", ""));
  top = parseInt(top.replace("px", ""));
  width = parseInt(width.replace("px", ""));
  height = parseInt(height.replace("px", ""));
  let newItems = [];
  let select = false;

  let itemX1 = 0;
  let itemY1 = 0;

  let itemX2 = 0;
  let itemY2 = 0;

  let selectX1 = left;
  let selectX2 = left + width;

  let selectY1 = top;
  let selectY2 = top + height;

  for await (let item of items) {
    itemX1 = parseInt(item.style.left.replace("px", ""));
    itemX2 = parseInt(item.style.left.replace("px", "")) + parseInt(item.style.width.replace("px", ""));

    itemY1 = parseInt(item.style.top.replace("px", ""));
    itemY2 = parseInt(item.style.top.replace("px", "")) + parseInt(item.style.height.replace("px", ""));

    if (selectX1 < itemX1 && itemX1 < selectX2 && selectY1 < itemY1 && itemY1 < selectY2 && selectX2 > itemX2 && itemY2 < selectY2) {
      if (select == false) {
        select = true;
      }

      newItems.push(item);
    }
  }

  return {
    select,
    newItems
  }
}

function moveSelectItem(items) {
  window.selectItem.addEventListener("mousedown", mousedown3, false);
  let left = 0;
  let top = 0;

  let preLeft = 0;
  let preTop = 0;

  function mousedown3(e) {
    window.addEventListener("mousemove", mousemove3);
    window.addEventListener("mouseup", mouseup3);

    let rects = [];
    let prevs = [];
    let $this = e.target;

    let prevX = e.clientX;
    let prevY = e.clientY;

    let prevLeft = parseInt($this.style.left.replace("px", ""));
    let prevTop = parseInt($this.style.top.replace("px", ""));

    for (var item of items) {
      left = item.getBoundingClientRect().left;
      top = item.getBoundingClientRect().top;
      rects.push({
        left,
        top
      });
    }

    for (var item of items) {
      preLeft = parseInt(item.style.left.replace("px", ""))
      preTop = parseInt(item.style.top.replace("px", ""))
      prevs.push({
        preLeft,
        preTop
      });
    }

    const rect = e.target.getBoundingClientRect();

    function mousemove3(e) {

      $this.style.left = (rect.left - rect.left + prevLeft) - (prevX - e.clientX) + "px";
      $this.style.top = (rect.top - rect.top + prevTop) - (prevY - e.clientY) + "px";

      for (var i = 0; i < items.length; i++) {
        items[i].style.left = (rects[i].left - rects[i].left + prevs[i].preLeft) - (prevX - e.clientX) + 'px';
        items[i].style.top = (rects[i].top - rects[i].top + prevs[i].preTop) - (prevY - e.clientY) + 'px';
      }

    }

    function mouseup3() {
      window.removeEventListener("mousemove", mousemove3);
      window.removeEventListener("mouseup", mouseup3);
    }

  }
}

function build(temp, background) {
  Jimp.read(background, (err, resBackground) => {
    for (var i = 0; i < temp.length; i++) {

      read(temp[i], function (image) {
        resBackground.blit(image, 0, 0, (err, resImage) => {
          resBackground = resImage;

          countToWrite = countToWrite + 1;

          if (countToWrite == temp.length) {
            resBackground.writeAsync('output.png');
            console.log('done');
          }
        });
      });

    }
  });
}

function buildArt(background, items, objectItems, countToWrite, position, order, left, top, width, height, rotate, btn) {
  let fileName = myInstalledDir + '/' + btn + 'output.png';
  Jimp.read(background, (err, resBackground) => {

    for (var i = 0; i < items.length; i++) {
      width = parseInt(objectItems[i].style.width.replace('px', ''));
      height = parseInt(objectItems[i].style.height.replace('px', ''));
      rotate = parseInt(parseNum(objectItems[i].style.transform));

      left = parseInt(objectItems[i].style.left.replace('px', '')) - 50;
      top = parseInt(objectItems[i].style.top.replace('px', ''));

      if (parseInt(parseNum(objectItems[i].style.transform)) > 0) {
        left = left - 17;
        top = top - 17;
      }

      getPosition(left, top, function (left, top) {

        if (items[i].childNodes[1].src.search(',') != -1) { // NẾU SRC ĐANG LÀ BASE64 thì phải đổi về buffer
          base64ToBuffer(items[i].childNodes[1].src.slice(22), function (thisUrlTextNew) {
            console.log(thisUrlTextNew);
            read(thisUrlTextNew, width * 8, height * 8, rotate, function (image) {

              resBackground.blit(image, left, top, (err, resImage) => {
                resBackground = resImage;

                countToWrite = countToWrite + 1;
                if (countToWrite == items.length) {
                  if (btn == 1) {
                    resBackground.writeAsync(fileName);
                    alert('Ảnh ' + fileName);
                  } else {
                    editWithMockup(resBackground);
                  }

                  document.getElementById('spin-build').classList.add('hidden');
                }

              });
            });

          });
        } else {
          read(items[i].childNodes[1].src.slice(7), width * 7, height * 7, function (image) {
            resBackground.blit(image, left, top, (err, resImage) => {
              resBackground = resImage;

              countToWrite = countToWrite + 1;

              if (countToWrite == items.length) {
                resBackground.writeAsync(fileName)
                alert('Ảnh ' + fileName);
                if (btn == 1) {
                  document.getElementById('spin-build').classList.add('hidden');
                } else {
                  document.getElementById('spin-build2').classList.add('hidden');
                }
              }
            });
          });
        }

      });
    }
  });
}

async function editWithMockup(resBackground) {
  let contentGenArt = document.getElementById('content-genart');
  let image = await resBackground.getBase64Async(Jimp.MIME_PNG);

  contentGenArt.innerHTML = '';
  contentGenArt.insertAdjacentHTML('beforeend', urlToArtHtml(image, 1, resBackground.bitmap.width / 8, resBackground.bitmap.height / 8, 50, 0, 12, false));
  processArt();
}

function getPosition(left, top, callback) {
  left = left * 8;
  top = top * 8;
  callback(left, top);
}

function checkBackGround(index, callback) {
  if (parseInt(index) == 0) {
    callback(true);
  } else {
    callback(false);
  }
}

function read(url, width, height, rotate, callback) {
  Jimp.read(url, (err, res) => {
    if (rotate > 0) {
      rotate = 360 - rotate;
    }
    res.resize(width, height).rotate(rotate);
    rotate = 0;
    callback(res);
  });
}

function processLogin(callback) {
  // START LOGIN

  var parser = new DomParser();
  axios.get(
      'http://ft.mmocare.com/site/login', {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-type": "Content-Type': 'application/x-www-form-urlencoded",
          "Authorization": `Basic cGFsbTpPQVJQUVlGMXZL`
        }
      },
    )
    .then((response) => {
        if (response) {
          console.log('Chưa đăng nhâp');
          console.log('Thực hiện đăng nhập ' + response.request.responseURL);
          var dom = parser.parseFromString(response.data);

          var form = new FormData();
          form.append('LoginForm[email]', 'bquocanh.97@gmail.com');
          form.append('LoginForm[password]', 'A12101997a');
          form.append('_csrf', dom.getElementsByName('_csrf')[0].attributes[2].value);
          form.append('LoginForm[rememberMe]', 0);
          form.append('login-button', '');

          axios.post("http://ft.mmocare.com/site/login", form, {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-type": "multipart/form-data",
              "Authorization": `Basic cGFsbTpPQVJQUVlGMXZL`
            }
          }, ).then(res => {
            if (res) {
              console.log("Đăng nhập thành công.");
              callback(true);
            }
          });

        }

      },
      (error) => {
        var status = error.response.status
      }
    );
  // END LOGIN
}

async function processFlipArt(currentImage, callback) {
  let image = await Jimp.read(currentImage);
  let bufImage = await image.flip(true, false).getBufferAsync(Jimp.MIME_PNG);
  var base64 = await bufferToBase64(new Uint8Array(bufImage));
  callback(base64)
}

async function importBackgroud() {
  let input = document.getElementById('input_file');
  let contentGenArt = document.getElementById("content-genart");

  if (input.files.length > 0) {
    readImageFolder(input.files[0].path, function (base64) {
      var i = new Image();

      i.onload = function () {
        contentGenArt.insertAdjacentHTML('beforeend', urlToArtHtml(base64, -1, i.width / 8, i.height / 8, 50, 0, 12, true));
        input.value = '';
      };

      i.src = base64;

    });
  }
}

async function bufferToBase64(buf) {
  var binstr = Array.prototype.map.call(buf, function (ch) {
    return String.fromCharCode(ch);
  }).join('');
  return btoa(binstr);
}

function base64ToBuffer(base64, callback) {
  var binary_string = window.atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  callback(bytes.buffer);
}

function readImageFolder(url, callback) {
  var request = new
  XMLHttpRequest();
  request.onload = function () {
    var file = new FileReader();
    file.onloadend = function () {
      callback(file.result);
    }
    file.readAsDataURL(request.response);
  };
  request.open('GET', url);
  request.responseType = 'blob';
  request.send();
}

function openCity(evt, cityName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}

// function selectAllWithMouse() {
//   const background = document.getElementById("content-genart");
//   background.addEventListener("mousedown", mousedown2, false);

//   function mousedown2 (e) {
//     if (e.target.getAttribute("id") == 'content-genart') {
//       let selectBorder = document.createElement("div");
//       background.insertAdjacentHTML('beforeend', selectBorder);
//       selectBorder.style.display = 'block';
//       console.log(e.target);
//       let prevX = e.clientX;
//       let prevY = e.clientY;
//       let rect = e.target.getBoundingClientRect();


//       selectBorder.style.left = e.clientX-262 + 'px';
//       selectBorder.style.top = e.clientY-150 + 'px';

//       selectBorder.className = "select-border";

//       window.addEventListener("mousemove", mousemove2);
//       window.addEventListener("mouseup", mouseup2);

//       function mousemove2(e) {
//         selectBorder.style.width = 0 - (prevX - e.clientX) + 'px';
//         selectBorder.style.height = 0 - (prevY - e.clientY) + 'px';
//       }

//       function mouseup2() {
//         console.log(background);
//         window.removeEventListener("mousemove", mousemove2);
//         window.removeEventListener("mouseup", mouseup2);
//       }
//     }

//   }
// }

async function urlToImage(file_id, parent_id, isMockup) {
  let contentGenArt = document.getElementById("content-genart");
  let filePath = './' + file_id + '.png';
  let bufImg = await googleReadFile(file_id, parent_id);

  let base64 = await bufferToBase64(new Uint8Array(bufImg));
  let image = await `data:image/png;base64, ${base64}`;

  Jimp.read(bufImg, (err, res) => {
    if (isMockup) {
      contentGenArt.insertAdjacentHTML('beforeend', urlToArtHtml(image, -1, res.bitmap.width, res.bitmap.height, 50, 0, 12, false));
      processArt();
    } else {
      contentGenArt.insertAdjacentHTML('beforeend', urlToArtHtml(image, -1, res.bitmap.width / 8, res.bitmap.height / 8, 50, 0, 12, true));
      document.getElementById('spin-sync-bg').classList.add('hidden');
      processArt();
    }

  });
}

navigationEventCreate();
navigationEventClick();

// Của google API 
// function google() {

// }
const {
  google
} = require('googleapis');
// const path = require('path');
// const CLIENT_ID = '235063591219-3ckp00j3c7r3i5nlkvnob99u7dihs6f6.apps.googleusercontent.com';
// const CLIENT_SECRET = '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';
// const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
// const REFRESH_TOKEN = '1//04GzgyoyEpxJaCgYIARAAGAQSNwF-L9Irs7QBfWfnRL3rSY29YyLEIZrNyCD_mStNdCAJrfI4VQpTMLXNZzuLumIU3IIs6Rqaxic';

const CLIENT_ID = '887929435972-qbpaclnk8dr9t6f079a2ln8010hadtll.apps.googleusercontent.com';
const CLIENT_SECRET = 'RheT-ss7Sx7sXsJj34r_cZka';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//042tIy8YV64QYCgYIARAAGAQSNwF-L9Irw6v1wskha-BGVJSq2fPKApsp_3hSZQmVOc5-AAYyZ18dINAoqNAgYY1ZlZTMvwnLoQ4';

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: REFRESH_TOKEN
});

const drive = google.drive({
  version: 'v3',
  auth: oauth2Client
});

function googleGetToken(callback) {
  fetch("https://oauth2.googleapis.com/token", {
    "headers": {
      "accept": "application/json",
      "accept-language": "en-US",
      "cache-control": "no-cache",
      "content-type": "application/x-www-form-urlencoded",
      "pragma": "no-cache",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site"
    },
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": "refresh_token=1%2F%2F04GzgyoyEpxJaCgYIARAAGAQSNwF-L9Irs7QBfWfnRL3rSY29YyLEIZrNyCD_mStNdCAJrfI4VQpTMLXNZzuLumIU3IIs6Rqaxic&client_id=235063591219-3ckp00j3c7r3i5nlkvnob99u7dihs6f6.apps.googleusercontent.com&client_secret=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&grant_type=refresh_token",
    "method": "POST",
    "mode": "cors"
  }).then(res => res.json()).then(val => callback(val.access_token));
}

function googleGetTokenSpalms() {
  fetch("https://oauth2.googleapis.com/token", {
    "headers": {
      "accept": "application/json",
      "accept-language": "en-US",
      "cache-control": "no-cache",
      "content-type": "application/x-www-form-urlencoded",
      "pragma": "no-cache",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site"
    },
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": "refresh_token=1%2F%2F042tIy8YV64QYCgYIARAAGAQSNwF-L9Irw6v1wskha-BGVJSq2fPKApsp_3hSZQmVOc5-AAYyZ18dINAoqNAgYY1ZlZTMvwnLoQ4&client_id=887929435972-qbpaclnk8dr9t6f079a2ln8010hadtll.apps.googleusercontent.com&client_secret=RheT-ss7Sx7sXsJj34r_cZka&grant_type=refresh_token",
    "method": "POST",
    "mode": "cors"
  });
}

async function googleUploadFile() {
  googleGetToken(function (token) {
    let input = document.getElementById('input_file');
    console.log(input.files[0]);
    let form = new FormData();
    form.append('metadata', new Blob([JSON.stringify({
      name: '2.png'
    })], {
      type: 'application/json'
    }));
    form.append('file', input.files[0]);

    fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: new Headers({
        'Authorization': `Bearer ${token}`
      }),
      body: form
    }).then(res => res.json()).then(val => console.log(val));
  });
}

async function googleReadFile(fileId, parent) {
  const response = await drive.files.get({
    fileId: fileId,
    parents: parent,
    alt: "media"
  }, {
    responseType: "arraybuffer"
  }, );

  return response.data
}

async function googleDeleteFile() {
  const response = await drive.files.delete({
    fileId: '1ENCIMSfX8-t_AaR4B_TjH2mKn4SvShex',
  });

  if (response.status == 204) {
    console.log('xoá thành công');
  } else {
    console.log(response);
  }
}
// End google API