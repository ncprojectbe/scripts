$(document).ready(function() {
    var maxLength = 200;  // De gewenste maximumlengte van de tekst

    $(".update-item-rich").each(function() {
        var myDiv = $(this);
        var originalText = myDiv.html();  // Bewaar de originele HTML-opmaak
        if (originalText.length > maxLength) {
            var shortenedText = originalText.substring(0, maxLength);
            var indexLastSpace = shortenedText.lastIndexOf(" ");
            shortenedText = shortenedText.substring(0, indexLastSpace);
            myDiv.html(shortenedText + '...<span class="read-more"> <a href="javascript:void(0);">meer weergeven</a></span>');
            myDiv.data("collapsedText", myDiv.html());  // Bewaar de ingekorte HTML-opmaak
            myDiv.data("originalText", originalText);
        }
    });

    $(document).on("click", ".read-more a", function() {
        var myDiv = $(this).closest('.update-item-rich');
        if (myDiv.hasClass('expanded')) {
            myDiv.html(myDiv.data("collapsedText"));
            myDiv.removeClass('expanded');
        } else {
            myDiv.html(myDiv.data("originalText"));
            myDiv.addClass('expanded');
        }
    });
});
