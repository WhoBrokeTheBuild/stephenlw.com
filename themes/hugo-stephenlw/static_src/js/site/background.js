(function($){
  var $background = null;
  var printText = "";
  var allowedExts = [
    'c', 'cpp', 'h',
    'go', 'asm',
    'Makefile', 'CMakeLists.txt',
    'sh', 'bat', 'ps1'
  ];

  var printTextToBackground = function()
  {
    if (printText.length == 0) return;

    var timeout = 5;
    if (printText[0] === '\n')
    {
      timeout = 15;
    }
    else if (printText[0] === '`' && printText[1] == '`')
    {
      printText = printText.slice(2);
      timeout = 500;
      setTimeout(printTextToBackground, timeout);
      return;
    }

    $background.append(printText[0]);
    printText = printText.slice(1);

    setTimeout(printTextToBackground, timeout);
  }

  var getRandomFile = function(data)
  {
    var fileData = null;
    while (data.tree.length > 0)
    {
      var i = Math.floor(Math.random() * data.tree.length);
      fileData = data.tree[i];

      if (allowedExts.indexOf(fileData.path.split('.').pop()) !== -1)
        break;

      data.tree.splice(i, 1);
    }

    if (data.tree.length == 0) return;

    printText += "$ cat " + fileData.path + "\n";

    $.ajax({
      url: fileData.url,
      dataType: "json"
    }).done(function(data){
      printText += atob(data.content);
    });

    return;
  }

  var getRandomRepo = function(data)
  {
    var i = Math.floor(Math.random() * data.length);
    var repoData = data[i];

    var objects = repoData.size / 2;
    var delta = repoData.size / 10;
    printText += "$ git clone " + repoData.ssh_url + "``\n";
    printText += "Cloning into '" + repoData.name + "'...``\n" +
                 "remote: Counting objects: " + objects + ", done.\n" +
                 "remote: Total " + objects + " (delta 0), reused 0 (delta 0), pack-reused " + objects + "\n" +
                 "Receiving objects: 100% (" + objects + "/" + objects + "), " + repoData.size + " KiB | 0 bytes/s, done.\n" +
                 "Resolving deltas: 100% (" + delta + "/" + delta + "), done.\n" +
                 "\n" +
                 "$ cd " + repoData.name + "\n";

    return $.ajax({
      url: "https://api.github.com/repos/" + repoData.full_name + "/git/trees/master?recursive=1",
      dataType: "json"
    }).done(function(data){
      getRandomFile(data);
    });
  }

  $(function(){
    $background = $('.background');

    $.ajax({
      url: "https://api.github.com/users/WhoBrokeTheBuild/repos",
      dataType: "json"
    }).done(function(data){
      getRandomRepo(data)
        .done(function(){
          printTextToBackground();
        });
    }).fail(function(httpObj, textStatus) {
      printText = "Failed to reach GitHub\n";
      printTextToBackground();
    });;
  });
})(jQuery);
