import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {
  fileForm!: FormGroup;
  selectedFile: File | null = null;
  message: string = '';
  maxSize = 5 * 1024 * 1024; // 5MB
  imagePreview: string[] = [];  

  constructor(private fb: FormBuilder, private router: Router, private service: CartService) {}

  ngOnInit(): void {
    this.fileForm = this.fb.group({
      image: [null, [Validators.required, this.mimeTypeValidator.bind(this)]]
    });
  }

  mimeTypeValidator(control: any) {
    const image = control.value;

    if (image && typeof image === 'object') {
      const mimeType = image.type;
      const validMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

      if (!validMimeTypes.includes(mimeType)) {
        return { invalidMimeType: true };
      }

      if (image.size > this.maxSize) {
        return { fileTooLarge: true };
      }
    }

    return null;
  }

  onFileChange(event: any) {
    const files = event.target.files;
    if (files.length > 0) {
      this.imagePreview = []; // Reset preview
      for (let image of files) {
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview.push(reader.result as string);
        };
        reader.readAsDataURL(image);
  
        // Update form and assign the first selected file
        this.fileForm.patchValue({ image: image });
        this.fileForm.get('image')?.updateValueAndValidity();
        this.selectedFile = image; // Assign the first file
      }
    }
  }

  onSubmit(): void {
    if (this.fileForm.valid && this.selectedFile) {
      const formData = new FormData();
      
      // Append 'image' instead of 'file' if the backend expects 'image'
      formData.append('image', this.selectedFile); 

      this.service.craetecart(formData).subscribe(
        (res: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Image Upload successful!',
            text: 'Image data added successfully',
            confirmButtonText: 'OK'
          });
          this.fileForm.reset();
          this.router.navigate(["/"]);
          console.log(res);
        },
        (err: any) => {
          if (err.status === 400) {
            Swal.fire({
              icon: 'error',
              title: 'Create Image Failed!',
              text: 'Image already exists',
              confirmButtonText: 'OK'
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Create Image Failed!',
              text: 'Something went wrong. Please try again later.',
              confirmButtonText: 'OK'
            });
          }
          console.error('Error:', err);
        }
      );
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.onFileChange({ target: { files } });
    }
  }
}
