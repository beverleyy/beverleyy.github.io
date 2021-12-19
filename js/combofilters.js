function comboFiltering($this, filters, filterAttr, filterValue, $optionSet, group, $selectAll, activeClass, exclClass) {
    if (!$optionSet.hasClass(exclClass)) {
        if (!$this.hasClass(activeClass) &&
            filterValue.length
        ) {
            filters[group].push(filterValue);
            $selectAll.removeClass(activeClass);
        } else if (filterValue.length) {
            var curIndex = filters[group].indexOf(filterValue);
            if (curIndex > -1) filters[group].splice(curIndex, 1);
            if (!$optionSet.find("a." + activeClass).not($this).length)
                $selectAll.addClass(activeClass);
        } else {
            $optionSet.find("a." + activeClass).removeClass(activeClass);
            filters[group] = [];
        }
    } else {
        if (!$this.hasClass(activeClass) && filterValue.length) {
            $optionSet.find("a." + activeClass).each(function(k, filterLink) {
                var removeFilter = $(filterLink).attr(filterAttr);
                var removeIndex = filters[group].indexOf(removeFilter);
                filters[group].splice(removeIndex, 1);
            });
            filters[group].push(filterValue);
            $optionSet.find("a." + activeClass).removeClass(activeClass);
        } else if (filterValue.length) {
            var curIndex = filters[group].indexOf(filterValue);
            if (curIndex > -1)
                filters[group].splice(curIndex, 1);
            if (!$optionSet.find("a." + activeClass).not($this).length)
                $selectAll.addClass(activeClass);
        } else {
            $optionSet.find("a." + activeClass).removeClass(activeClass);
            filters[group] = [];
        }
    }
}

function getComboFilter(filters) {
    var i = 0;
    var comboFilters = [];
    for (var prop in filters) {
        var filterGroup = filters[prop];
        if (!filterGroup.length) {
            continue;
        }
        if (i === 0) {
            comboFilters = filterGroup.slice(0);
        } else {
            var filterSelectors = [];
            var groupCombo = comboFilters.slice(0);
            for (var k = 0, len3 = filterGroup.length; k < len3; k++) {
                for (var j = 0, len2 = groupCombo.length; j < len2; j++) {
                    filterSelectors.push(groupCombo[j] + filterGroup[k]);
                }
            }
            comboFilters = filterSelectors;
        }
        i++;
    }
    var comboFilter = comboFilters.join(", ");
    return comboFilter;
}