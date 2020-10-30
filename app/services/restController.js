class RestController {

    constructor() {}

    get(url, onSuccess) {
        $.get({
            url: url,
            success: onSuccess,
            dataType: 'json'
        });

    }

    post(url, data, onSuccess) {
        $.post({
            type: "POST",
            url: url,
            data: JSON.stringify(data),
            dataType: 'json',
            success: onSuccess,
            contentType: "application/json"
        });


    }

    delete(url, onSuccess) {
        $.ajax({
            type: "DELETE",
            url: url,
            dataType: 'json',
            success: onSuccess
        });
    }


    postComment(url, data, onSuccess) {
        $.post({
            type: "POST",
            url: url,
            data: JSON.stringify(data),
            dataType: 'json',
            success: onSuccess,
            contentType: "application/json"
        });


    }
}