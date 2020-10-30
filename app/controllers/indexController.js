class IndexController{
	
    constructor(){
        this.title;
        this.subtitle;
        this.body;
        this.image;
        this.publicCheck;
        this.featuredCheck;
        this.created_date;
        this.tags
        this.articleID = [];
        this.restController = new RestController();
        
        this.newArticle = false;
        this.newArticleTime = false;
        this.newArticleImg = false;
        this.getComment = false;
        this.editArticle = false;

	}
	
	init() {
        $(document).ready(function () {
            this.title = $("#title");
            this.subtitle = $("#subtitle");
            this.body = $("#body");
            this.image = $("#image");
            this.publicCheck = $("#publicCheck");
            this.featuredCheck = $("#featuredCheck");
            this.tags = $("#tags");
            this.getArticle();
            //Post insert
            $("#saveArticleBtn").click(this.addArticle.bind(this));
        }.bind(this));

    }

    addArticle() {
        this.closeModal();
        var pub = this.publicCheck.prop("checked") ? 'public' : 'draft';
        var fea = this.featured.prop("checked");
        this.newArticle=true;
        this.newArticleTime=true;
        this.newArticleImg=true;
        var date= new Date;
        var tags= this.addTag();
        var a = new Article(this.title.val(), this.subtitle.val(), this.body.val(), pub, fea, this.image.val(), tags, date);
        this.newArticle(a);
        this.resetModal();
    }

    getArticle() {
        this.restController.get("http://localhost:3000/articles", function (data, status, jqXHR) {
            for (let id in data) {
                this.showArticle(data[id]);
                console.log(data[id])
                this.articleID.push(data[id]._id);
                this.getComment=true;
            }
        }.bind(this));
    }
    
    addTag(){
        var t=[];
        for(let i in this.tag.val().split('#')){
            var tag=this.tag.val().split('#')[i];
            if(tag!='') t.push(tag);
        }
        return t;
    }

    newArticle(article) {
        this.restController.post("http://localhost:3000/articles", data, function (data, status, jqXHR) {
        this.showArticle(article);    
        console.log('', article);
        }.bind(this))
    }

    showArticle(article) {
        if(article.draft == 'public') {
            this.buildCard(article);
        }
    }

    showComment(commentArticle, articleContainer){
        return articleContainer.find('#nuovoCommento').append('<li class="list-group-item">'+commentArticle.author +'</p>'+ commentArticle.body +'</li>')
    }

    deleteArticle(article, articleContainer) {
        if(!this.newArticle){
            articleContainer.css("display", "none");
            console.log('id: '+article._id+', titolo: '+article.title);
            this.restController.delete(`http://localhost:3000/articles/` + article._id + `.json`, function (data, status, jqXHR) {
            }.bind(this))
        }else{
            articleContainer.css("display", "none");
            this.newArticle=false;
        }
    }

    addComment(article, articleContainer){
        var comment=new Comment(articleContainer.find('#commentText').val(), article.author);
        if( comment.body!=''){
            this.restController.articleComment("http://localhost:3000/comments/"+post._id , comment, function (data, status, xhr) {
            this.showComment(comment, articleContainer);
            }.bind(this))
        }
    }

    addTag(tags, ArticleTag){
        for(var i=0; i<tags.length; i++){
            ArticleTag.append('<span class="badge badge-pill badge-primary">#' +tags[i] + '</span>');
        }
    }

    addTime(article, articleDate){
        var day,month,year;
        if(this.newArticleTime){
            var dataPubblicazione=article.created_date.toString();
            day= dataPubblicazione.split(' ')[2]
            month= dataPubblicazione.split(' ')[1]
            year= dataPubblicazione.split(' ')[3]
            articleDate.html('Articolo pubblicato in data: ' +day+' '+month+ ' '+ year);
            this.newArticleTime=false;
        }else{
            var msec = Date.parse( article.created_date.split('T')[0]);
            var d = new Date(msec).toString();
            day= d.split(' ')[2]
            month= d.split(' ')[1]
            year= d.split(' ')[3]
            articleDate.html('Articolo pubblicato in data: '+day+' '+month+ ' '+ year);
        }
    }

    addImg(article, articleImg){
        if(this.newArticleImg){
            (article.img != "") ? articleImg.html('<img class="card-img-top" src="' + article.img + '" alt="immagine non trovata" style="max-width:100%;max-height:300px;">') : "";
            this.newArticleImg=false;
        }else{
            (article.img != "") ?  articleImg.html('<img class="card-img-top" src="' + article.img + '" alt="immagine non trovata" style="max-width:100%;max-height:300px;">') : "";
        }
    }

    articleCard(article) {
        var articleContainer = $("#articleContainerStyle").clone();
        articleContainer.css("display", "block");
        articleContainer.attr("id", "");
        articleContainer.addClass("class", "articleContainer");
        var articleTitle = articleContainer.find(".card-title");
        var articleSubtitle = articleContainer.find(".card-subtitle");
        var articleBody = articleContainer.find(".card-text");
        var articleDate = articleContainer.find("#date");
        var articleImg = articleContainer.find("#img");
        var articleFeatured = articleContainer.find('#card-header');
        var articleTags = articleContainer.find('#tags');
        if (article.featured) articleFeatured.html('<span class="badge badge-secondary float-center">Featured</span>');
        articleTitle.html(article.title);
        articleSubtitle.html(article.subtitle);
        articleBody.html(article.body);
        this.addTag(article.tags, articleTags);
        this.addTime(article, articleDate);
        this.addImg(article, articleImg);
        article.featured ? $("#articleContainer").prepend(articleContainer) : $("#articleContainer").append(articleContainer);
        if(this.getComment){
            for(let i in article.article_comments){
                this.showComment(article.article_comments[i], articleContainer);
                this.getComment=false;
            }
        }
        articleContainer.find("#editArticle").click(function(){
            this.editArticle=true;
            this.updateArticle(article, articleContainer);
        }.bind(this))
        articleContainer.find("#deleteArticle").click(function(){
            this.deleteArticle(article, articleContainer);
        }.bind(this))
        articleContainer.find("#commentArticle").click(function(){
            this.addComment(article, articleContainer);
        }.bind(this))
    }

    closeModal() {
        $("#modal").modal("hide");
    }

    resetModal() {
        this.title.val("");
        this.body.val("");
        this.subtitle.val("");
        this.image.val("");
        this.tag.val("");
    }

}