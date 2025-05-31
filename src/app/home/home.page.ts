import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { supabase } from 'src/app/supabase.client';
import { IonicModule } from '@ionic/angular';

interface Message {
  id: string;
  user_name: string;
  content: string;
  created_at: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class HomePage implements OnInit, OnDestroy {
  messages: Message[] = [];
  newMessage: string = '';
  userName: string = '';
  private messageSubscription: any;
  email = '';

  constructor(private router: Router) { }

  async ngOnInit() {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      this.router.navigate(['/auth']);
    } else {
      this.email = data.user.email || '';
    }

    this.loadMessages();

    this.messageSubscription = supabase
      .channel('messages-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'Practica' },
        (payload) => {
          this.messages.push(payload.new as Message);
        }
      )
      .subscribe();
  }

  async logOut() {
    await supabase.auth.signOut();
    this.router.navigate(['/auth']);
  }

  async loadMessages() {
    const { data, error } = await supabase
      .from('Practica')
      .select('*')
      .order('created_at', { ascending: true });

    if (data) {
      this.messages = data;
    }
  }

  async sendMessage() {
    if (this.newMessage.trim() === '' || this.userName.trim() === '') return;

    await supabase.from('Practica').insert([
      {
        user_name: this.userName,
        content: this.newMessage,
      },
    ]);

    this.newMessage = '';
  }

  async uploadFile(event: any) {
    const file: File = event.target.files[0]
    if (!file) return;

    const fileExt = file.name.split('.').pop()
    const filePath = `chat_files/${Date.now()}.${fileExt}`

    const { data, error } = await supabase.storage
      .from('archives')
      .upload(filePath, file)
    if (error) {
      alert(error.message || 'Error al subi el archivo')
      console.error('Error al subir archivo:', error.message);
    } else {
      alert('Archivo subido con exito')
      console.log('Archivo subido con éxito:', data);
      const { data: urlData } = supabase
        .storage
        .from('archives')
        .getPublicUrl(filePath);

      console.log('URL pública del archivo:', urlData.publicUrl);
    }
  }



  ngOnDestroy(): void {
    if (this.messageSubscription) {
      supabase.removeChannel(this.messageSubscription);
    }
  }
}