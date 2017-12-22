function ProductPageCreator(domDetails){
  this.allProducts = [];
  this.sideFilters = domDetails.filter;
  this.content = domDetails.content;
  this.footer  = domDetails.footer;
  this.availableFilter = ['brand', 'color', 'soldOut'];
}

ProductPageCreator.prototype.init = function(){
  this.getJsonData();
}

ProductPageCreator.prototype.getJsonData = function(){
  var _this = this;
  $.getJSON("product.json")
    .done(function(data){
      $.each(data, function(key, value){
        _this.createProduct(value);
      });
      _this.allProductsShowing = _this.allProducts;
      _this.selectedValue = _this.allProducts.length;
      _this.createSideFilter();
      _this.showProducts(0, _this.allProductsShowing.length - 1);
    });
};

//1
ProductPageCreator.prototype.createProduct = function(value){
  var product = new Product(value);
  this.allProducts.push(product);
}

//2
ProductPageCreator.prototype.createSideFilter = function(){
  this.createCategoryFilter("brand");
  this.sideFilters.append("<hr>");
  this.createCategoryFilter("color");
  this.sideFilters.append("<hr>");
  this.createAvailableFilter();
  this.sideFilters.append("<hr>");
  this.createSelectBoxForPagination();
  this.sideFilters.append("<hr>");
  this.createSelectBoxForSorting();
}

//2.1
ProductPageCreator.prototype.createCategoryFilter = function(val){
  var uniqueValuesInCategory = [];
  this.allProducts.forEach(function(element){
    var valueToinsert = (val == "brand") ? element.brand : element.color;
    uniqueValuesInCategory.push(valueToinsert);
  });
  var uniqueValuesInCategory = Array.from(new Set(uniqueValuesInCategory)).sort();

  var _this = this;
  var list = $("<ol></ol>");
  uniqueValuesInCategory.forEach(function(element){
    var colorListItem = $("<li></li>");
    var checkbox = $("<input>");
    checkbox.attr({
      type: "checkbox",
      name: val,
      value: element,
      id: element
    });

    checkbox.on("click", $.proxy(_this.checkboxClick, _this));

    var labelColor = $("<label></label>");
    labelColor.text(element);
    labelColor.attr("for", element);
    colorListItem.append(labelColor, checkbox);
    list.append(colorListItem);
    _this.sideFilters.append(list);
  });
}
ProductPageCreator.prototype.checkboxClick = function(){
  var result = this.allProducts;
  for(var i = 0; i < this.availableFilter.length; i++){
    var selected = $("input:checked").filter("[name=" + this.availableFilter[i] + "]").map(function(){ return this.value; }).get();
    if(selected.length > 0){
      var valuesForThisFilter = [];
      for(var j = 0; j < result.length; j++){
        if(selected.includes(result[j][this.availableFilter[i]])){
          valuesForThisFilter.push(result[j]);
        }
      }
      if(valuesForThisFilter.length == 0){
        result = valuesForThisFilter;
        break;
      }else{
        result = valuesForThisFilter;
      }
    }
  }
  this.allProductsShowing = result;
  this.createFooter(this.allProductsShowing.length);
  if (this.selectedValue < this.allProductsShowing.length)
    this.showProducts(0, this.selectedValue-1);
  else
    this.showProducts(0, this.allProductsShowing.length-1)
}

//2.2
ProductPageCreator.prototype.createAvailableFilter = function(){
  var _this = this;
  var availableLabel = $("<label></label>");
  availableLabel.text("Available");
  availableLabel.attr("for", "available").css("margin-left", "15px");

  var availableCheckbox = $("<input>");
  availableCheckbox.attr({
    type: "checkbox",
    name: "soldOut",
    value: "0",
    id:"available"
  });

  var availableList = $("<p></p>");
  availableList.append(availableLabel, availableCheckbox);
  availableCheckbox.on("click", $.proxy(_this.checkboxClick, _this));
  this.sideFilters.append(availableList);
};
//2.3
ProductPageCreator.prototype.createSelectBoxForPagination = function(){
  this.selectBox = $("<select></select>");
  this.selectBox.css({
    width: "100px",
    "margin-left": "15px"
  })
  var optionInitial = $("<option></option>");
  optionInitial.attr("value", "20");
  optionInitial.text("all");

  var option3 = $("<option></option>");
  option3.attr("value", "3");
  option3.text("3");

  var option6 = $("<option></option>");
  option6.attr("value", "6");
  option6.text("6");

  var option9 = $("<option></option>");
  option9.attr("value", "9");
  option9.text("9");

  this.selectBox.append(optionInitial, option3, option6, option9);

  var _this = this;
  this.selectBox.on("change", function(){
    _this.selectedValue = $(this).val();
    _this.createFooter();
    _this.showProducts(0, _this.selectedValue-1);
  });

  this.sideFilters.append(this.selectBox);
}


ProductPageCreator.prototype.createFooter = function(){
  var max = this.allProductsShowing.length;
  var numberOfButtonsToCreate = Math.ceil(max/this.selectedValue);
  var start, end;
  this.footer.text("");
  for(var i = 0; i < numberOfButtonsToCreate; i++){
    var pageNumber = $("<span></span>");
    pageNumber.text(i+1);
    pageNumber.css({
      "margin-right": "10px",
      "cursor":"pointer"
    })
    var _this = this;
    (function(buttonNumber){
      pageNumber.on("click", function(){
        start = buttonNumber * +_this.selectedValue;
        end = start + +_this.selectedValue - 1;
        _this.showProducts(start, end, buttonNumber);
      });
    })(i);
    this.footer.append(pageNumber);
  }
}
//2.4
ProductPageCreator.prototype.createSelectBoxForSorting = function(){
  var sortingSelectBox = $("<select></select>");
  sortingSelectBox.css({
    width: "100px",
    "margin-left": "15px"
  })
  var optionName = $("<option></option>");
  optionName.attr("value", "name");
  optionName.text("Sort by Name");

  var optionColor = $("<option></option>");
  optionColor.attr("value", "color");
  optionColor.text("Sort by Color");

  var optionAvailability = $("<option></option>");
  optionAvailability.attr("value", "soldOut");
  optionAvailability.text("Sort by Availability");

  var optionBrand = $("<option></option>");
  optionBrand.attr("value", "brand");
  optionBrand.text("Sort by Brand");

  sortingSelectBox.append(optionName, optionColor, optionAvailability, optionBrand);

  var _this = this;
  sortingSelectBox.on("change", function(){
    _this.sortSelectedValue = $(this).val();
    _this.onSortClickEvent();
    _this.showProducts(0, _this.selectedValue-1);
  });

  this.sideFilters.append(sortingSelectBox);
}
ProductPageCreator.prototype.onSortClickEvent = function(){
  var _this = this;
    if(this.sortSelectedValue == "name" || this.sortSelectedValue == "soldOut"){
      this.allProductsShowing.sort(function(a, b){
        return a[_this.sortSelectedValue] - b[_this.sortSelectedValue];
      });
    } else{
      this.allProductsShowing.sort(function(a, b){
        var nameA = a[_this.sortSelectedValue].toUpperCase();
        var nameB = b[_this.sortSelectedValue].toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
    }
}

//3
ProductPageCreator.prototype.showProducts = function(from, to, buttonNumber = 0){
  this.content.empty();
  var _this = this;
  this.footer.find("span").eq(buttonNumber).css("color", "red").siblings().css("color", "white");
  if (to > this.allProductsShowing.length-1) { to = this.allProductsShowing.length-1 }
    for(var i = from; i <= to; i++){
      var element = this.allProductsShowing[i];
      var productDiv = $("<div></div>");
      productDiv.css({
        float:"left",
        border: "2px solid black",
        width: "100px",
        height: "100px",
        margin: "20px",
        padding: "10px",
        position: "relative"
      });

      var productImg = $("<img>");
      productImg.attr({
        "src": "images/"+ element.url
      }).css({
        position: "absolute",
        width: "100px",
        height: "80px",
        top:"20px"
      });

  productDiv.append(productImg);
  _this.content.append(productDiv);
  }
}


////////////////////////////////////////////////////////////
function Product(value){
  this.brand = value.brand;
  this.color = value.color;
  this.name = value.name;
  this.soldOut = value.sold_out;
  this.url = value.url;
}
////////////////////////////////////////////////////////////
$(document).ready(function(){
  var domDetails = {
    content: $("#content"),
    filter: $("#filters"),
    footer: $("#footer")
  }
  var productPageCreator = new ProductPageCreator(domDetails);
  productPageCreator.init();
})
