(function (global) {
    function Pager(el,options){
        this.el = el;
        this.options = {
            currentPage : 1,    //页码
            totalCount: options.totalCount || 1,   //总条数
            pageSize: options.pageSize || 10,    //每页显示条数
            callback: options.callback || function(){}  //回调函数
        };
        this.pageCount = 1;
        this.init();
    }
    Pager.prototype = {
        constructor: Pager,
        init: function(){
            var pageCount = Math.ceil(this.options.totalCount / this.options.pageSize); //计算总页数
            this.options.currentPage = 1;
            this.pageCount = pageCount;
            this.creatLis(1);
            this.options.callback(1,this.options.pageSize);
        },
        //计算页码总数和生成页码列表
        creatLis:function(currentPage){
            var liListCount =  this.pageCount < 5 ?  this.pageCount : 5; //li的个数
            var lis = [];
            // console.log(liListCount,currentPage);
            if(this.pageCount<=5) {
                for(var i = 1;i<=liListCount;i++){
                    lis.push(i);
                }
            }else if(currentPage <=3){
                for(var i = 1;i<=liListCount;i++){
                    lis.push(i);
                } 
            }else if(currentPage>3 && currentPage<=this.pageCount-2){
                lis = [currentPage-2,currentPage-1,currentPage,currentPage+1,currentPage+2];
            }else {
                lis = [this.pageCount-4,this.pageCount-3,this.pageCount-2,this.pageCount-1,this.pageCount];
            }
            // console.log(lis);
            this.creatDom(lis);
        },
        //创建dom结构
        creatDom:function(lis){
            var liDom = '';
            for(var i=0 ; i < lis.length; i++){
                liDom += '<li>'+lis[i]+'</li>'
            }
            var pagerDom = '<div class="page">' +
                    '<input type="button" value="首页" class="first-page">' +
                    '<input type="button" value="上一页" class="prev-page">' +
                    '<div class="page-num">' +
                        '<ul>' + liDom + '</ul>' +
                    '</div>' +
                    '<input type="button" value="下一页" class="next-page">' +
                    '<input type="button" value="尾页" class="last-page">' +
                    '<span style="margin-left:20px;">共 ' +   this.pageCount + ' 页</span>' +
                    '<input type="text" value="" style="width: 50px;margin-right: 5px;" class="inputPage">' +
                    '<input type="button" value="跳转" class="go-page">' +
                '</div>' +
                '<div class="page-size">' +
                    '<span>每页显示</span>' +
                    '<select name="pageSize" class="select-page-size">' +
                        '<option value="2">2</option>' +
                        '<option value="5">5</option>' +
                        '<option value="10">10</option>' +
                        '<option value="30">30</option>' +
                        '<option value="50">50</option>' +
                        '<option value="100">100</option>' +
                    '</select>' +
                    '<span>条</span>' +
                '</div>';
            this.el.innerHTML = pagerDom;
            this.bindEvent();
            this.addStyle();
        },
        //添加样式和设置每页显示个数
        addStyle:function(){
            var selectPageSize = document.querySelector('.select-page-size'),
                firstPage = document.querySelector('.first-page'),  //首页
                prevPage = document.querySelector('.prev-page'),    //上一页
                nextPage = document.querySelector('.next-page'),    //下一页
                lastPage = document.querySelector('.last-page'),    //末页
                lis = document.querySelectorAll('li');
            lis.forEach(item=>{
                if(item.innerHTML == this.options.currentPage) {
                    item.setAttribute('class','active');
                }
            });
            selectPageSize.childNodes.forEach(item=>{
                if(item.innerHTML == this.options.pageSize) {
                    item.setAttribute('selected',true);
                }
            });
            if(this.options.currentPage == this.pageCount){
                nextPage.style.cursor = 'not-allowed';
                lastPage.style.cursor = 'not-allowed';
                nextPage.style.color = '#ccc';
                lastPage.style.color = '#ccc';
            }
            if(this.options.currentPage == 1){
                prevPage.style.cursor = 'not-allowed';
                firstPage.style.cursor = 'not-allowed';
                prevPage.style.color = '#ccc';
                firstPage.style.color = '#ccc';
            }

        },
        //绑定事件
        bindEvent: function(){
            var _self = this,
                firstPage = document.querySelector('.first-page'),  //首页
                prevPage = document.querySelector('.prev-page'),    //上一页
                nextPage = document.querySelector('.next-page'),    //下一页
                lastPage = document.querySelector('.last-page'),    //末页
                inputPage = document.querySelector('.inputPage'),   //输入框
                goPage = document.querySelector('.go-page'),        //跳转
                selectPageSize = document.querySelector('.select-page-size'),   //每页显示个数
                lis = document.querySelectorAll('li');      //页码
                // console.log(lis);
            lis.forEach(item=>{
                item.addEventListener('click',function(){
                    _self.options.currentPage = +this.innerHTML;
                    _self.creatLis(_self.options.currentPage);
                    _self.options.callback(_self.options.currentPage,_self.options.pageSize);
                })
            });
            selectPageSize.addEventListener('change', function(){
                _self.options.pageSize = +this.value;
                _self.init();
            });
            firstPage.addEventListener('click',function(){
                _self.options.currentPage = 1;
                _self.creatLis(_self.options.currentPage);
                _self.options.callback(_self.options.currentPage,_self.options.pageSize);
            });
            lastPage.addEventListener('click',function(){
                if(_self.options.currentPage == _self.pageCount) {
                    return false;
                }
                _self.options.currentPage = _self.pageCount;
                _self.creatLis(_self.options.currentPage);
                _self.options.callback(_self.options.currentPage,_self.options.pageSize);
            });
            prevPage.addEventListener('click',function(){
                if(_self.options.currentPage == 1) {
                    return false;
                }
                _self.options.currentPage--;
                _self.creatLis(_self.options.currentPage);
                _self.options.callback(_self.options.currentPage,_self.options.pageSize);
            });
            nextPage.addEventListener('click',function(){
                if(_self.options.currentPage == _self.pageCount) {
                    return false;
                }
                _self.options.currentPage++;
                _self.creatLis(_self.options.currentPage);
                _self.options.callback(_self.options.currentPage,_self.options.pageSize);
            });
            goPage.addEventListener('click',function(){
                if(+inputPage.value > _self.pageCount) {
                    alert('页码超出范围');
                    return false;
                }
                _self.options.currentPage = +inputPage.value;
                _self.creatLis(_self.options.currentPage);
                _self.options.callback(_self.options.currentPage,_self.options.pageSize);
            })
        },
        
    }
    global.pager = {
        init: function (el,options) {
            return new Pager(el,options);
        }
    }
})(window);