import * as mongoose from 'mongoose';

let fileSchema = new mongoose.Schema({
    name: String,
    content: String
});

export interface IFile extends mongoose.Document {
    name: string,
    content: string
}

export class DatabaseHandler {

    private model: mongoose.Model<IFile>;

    constructor(callback: Function) {

        mongoose.connect('mongodb://localhost/local');
        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function () {
            console.log('Database Connection Ready!');
            callback();
        });
        this.model = db.model<IFile>('file', fileSchema);
    }


    getFile(name: string): Promise<IFile> {

        return this.model
            .findOne({ name: name })
            .then();
    }

    createFile(name: string): Promise<IFile> {
        let newFile = new this.model({ name: name, content: 'This is a new file named: ' + name + '!' });
        return newFile.save().then();
    }

    updateFile(obj: { name: string, content: string }) {
        this.model
            .findOne({ name: obj.name })
            .then(file => {
                file = file as IFile;
                file.content = obj.content;
                file.save()
                    .then(() => {
                        console.log('Change Saved');
                    })
                    .catch(err => console.error(err));

            })
            .catch(err => {
                console.error(err);
            });
    }

    deleteFile(name: string) {
        this.getFile(name)
            .then(file => file.remove())
            .then(() => console.log('File:' + name + ' is removed!'))
            .catch(err => console.error(err));
    }

}

// we're connected!
//let File = mongoose.model('file', fileSchema);

//let testFile = new File({ name: 'testFile3', content: 'This is a new test file!!' });
//testFile.save(saveCheck);

//File.findOne({ name: 'testFile1' }, getFileCheck);


//File.find(getFilesCheck);

//db.close();

//function getFileCheck(err, file) {
//    if (err) console.error(err);
//
//    console.log(file.content);
//}
//
//function getFilesCheck(err, files) {
//    if (err) console.error(err);
//
//    files.forEach(file => {
//        console.log(file.content);
//    });
//}
//
//function saveCheck(err, files) {
//    if (err) console.error(err);
//
//    console.log('Elemet inserted!');
//
//};