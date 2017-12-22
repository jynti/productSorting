function ProductPageCreator(domDetails){
  this.sideFilters = domDetails.filter;
  this.footer = domDetails.footer;
  this.productContentArea = domDetails.productContentArea;
  this.allProducts = [];
}
ProductPageCreator.prototype.init = function(){
  this.getJsonData();
}
ProductPageCreator.prototype.getJsonData = function(){
  var _this = this;
  $.ajax({
    url: "product.json",
    context: _this,
    dataType: "json"
  }).done(_this.onJsonSuccess);
};

ProductPageCreator.prototype.onJsonSuccess = function(data){
  var _this = this;
  $.each(data, function(key, value){
    _this.createProduct(value);
  });
  this.createSideFilter();
  Product.show(0, this.allProducts.length - 1, this.allProducts, this.productContentArea);
}

ProductPageCreator.prototype.createProduct = function(value){
  var product = new Product(value);
  this.allProducts.push(product);
}

ProductPageCreator.prototype.createSideFilter = function(){
  var domDetails = {
    sideFilters: this.sideFilters,
    productContentArea: this.productContentArea,
    footer: this.footer
  }
  var brandFilter = new Filter("brand", this.allProducts, domDetails);
  brandFilter.init();

  var colorFilter = new Filter("color", this.allProducts, domDetails);
  colorFilter.init();

  var soldFilter = new Filter("available", this.allProducts, domDetails);
  soldFilter.init();

  var optionValues = [["20", "all"], ["3","3"], ["6","6"], ["9","9"]];

  var pageSelectBox = new SelectBox("pagination", optionValues, domDetails);
  pageSelectBox.init();

  var optionValues = [["name", "Sort by Name"], ["color", "Sort by Color"], ["available", "Sort by Availability"], ["brand", "Sort by Brand"]];
  var sortSelectBox = new SelectBox("sorting", optionValues, domDetails);
  sortSelectBox.init();
}
///////////////////////////////////////////////////////////
$(document).ready(function(){
  var domDetails = {
    productContentArea: $("#content"),
    filter: $("#filters"),
    footer: $("#footer")
  }
  var productPageCreator = new ProductPageCreator(domDetails);
  productPageCreator.init();
})
