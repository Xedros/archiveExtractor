// Copyright (c) 2017 Matthew Brennan Jones <matthew.brennan.jones@gmail.com>
// This software is licensed under a MIT License
// https://github.com/workhorsy/uncompress.js

let fileInput = document.getElementById('fileInput');
let filePassword = document.getElementById('filePassword');
let entryList = document.getElementById('entryList');
let errorList = document.getElementById('errorList');

function onArchiveLoaded(archive) {
	let is_error = false;
	archive.entries.forEach(function(entry) {
		if (! entry.is_file) return;
		if (is_error) return false;

		entry.readData(function(data, err) {
			if (err) {
				is_error = true;
				errorList.innerHTML = err;
				entryList.innerHTML = '';
				return;
			}

			entryList.innerHTML +=
			'<b>Name:</b> ' + entry.name + '<br />' +
			'<b>Compressed Size:</b> ' + entry.size_compressed + '<br />' +
			'<b>Uncompressed Size:</b> ' + entry.size_uncompressed + '<br />' +
			'<b>Is File:</b> ' + entry.is_file + '<br />';

			let url = URL.createObjectURL(new Blob([data]));
			entryList.innerHTML += '<a href="' + url + '">download</a>' + '<br />';

			entryList.innerHTML += '<hr />';
		});
	});
}

// Load all the archive formats
loadArchiveFormats(['rar', 'zip', 'tar'], function() {
	fileInput.onchange = function() {
		// Just return if there is no file selected
		if (fileInput.files.length === 0) {
			entryList.innerHTML = 'No file selected';
			return;
		}

		// Get the selected file
		let file = fileInput.files[0];

		let password = filePassword.value;

		// Open the file as an archive
		archiveOpenFile(file, password, function(archive, err) {
			if (archive) {
				console.info('Uncompressing ' + archive.archive_type + ' ...');
				entryList.innerHTML = '';
				onArchiveLoaded(archive);
			} else {
				entryList.innerHTML = '<span style="color: red">' + err + '</span>';
			}
		});
	};

	fileInput.disabled = false;
});
