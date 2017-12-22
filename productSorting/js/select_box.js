function SelectBox(name, optionValues, domElement){
  this.name = name;
  this.optionValues = optionValues;
  this.sideFilter = domElement.sideFilters;
  this.productContentArea = domElement.productContentArea;
  this.footer = domElement.footer;
}

SelectBox.prototype.init = function(){
  this.createOptions();
}

SelectBox.prototype.createOptions = function(){
  var selectBox = $("<select></select>").addClass("select-box");

  for(var i = 0; i < this.optionValues.length; i++){
    var option = $("<option></option>");
    if(i == 0) {option.prop("selected", true);}
    option.attr("value", this.optionValues[i][0]).text(this.optionValues[i][1]);
    selectBox.append(option);
  }

  var _this = this;
  selectBox.on("change", function(){
    _this.selectedValue = $(this).val();
    if(_this.name == "pagination")
      _this.constructor.selectedValue = $(this).val();
    else
      _this.constructor.sortSelectedValue = $(this).val();
    _this.onChangeEvent()
  });
  this.sideFilter.append(selectBox);
  this.sideFilter.append("<hr>");
}

SelectBox.prototype.onChangeEvent = function(){
  this.visibleProducts = Product.getVisibleProducts();
  if(this.name == "pagination"){
    this.createFooter();
    Product.show(0, this.selectedValue-1, this.visibleProducts, this.productContentArea);
  } else {
    var selectedPagination = SelectBox.getPresentlySelectedValue();
    Product.show(0, selectedPagination-1, this.visibleProducts, this.productContentArea);
  }
}

SelectBox.onSortClickEvent = function(selectedValue, visibleProducts){
  if(selectedValue == "name" || selectedValue == "available"){
      visibleProducts.sort(function(a, b){
        return a[selectedValue] - b[selectedValue];
      });
    } else{
      visibleProducts.sort(function(a, b){
        var nameA = a[selectedValue].toUpperCase();
        var nameB = b[selectedValue].toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
    }
    return visibleProducts;
}

SelectBox.prototype.createFooter = function(){
  var domDetails = {
    footer: this.footer,
    productContentArea: this.productContentArea
  }

  var footer = new Footer(this.visibleProducts, this.selectedValue, domDetails);
  footer.init();
  footer.highlightButton(0);
}

SelectBox.getPresentlySelectedValue = function(){
  if(!this.selectedValue){
    this.selectedValue = "20"
  }
  return this.selectedValue;
}

SelectBox.getPresentlySelectedSortValue = function(){
  if(!this.sortSelectedValue){
    this.sortSelectedValue = "name"
  }
  return this.sortSelectedValue;
}
