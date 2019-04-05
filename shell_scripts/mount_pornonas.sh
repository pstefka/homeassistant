

mount -t cifs -r -o user=backup '\\pornonas\homes\backup_nuc/' /mnt/pornonas_backup/
echo -n '//192.168.1.10/backup_nuc/ /mnt/pornonas_backup/       cifs    credentials=/root/.smbcredentials,rw,nounix,iocharset=utf8,file_mode=0777,dir_mode=0777 0 0' >> /etc/fstab
#mount -t cifs -r -o user=backup '\\pornonas\homes\kule\CloudStation' /mnt/pornonas_smartphone_photo_backup/
echo -n '//192.168.1.10/homes/kule/CloudStation/ /mnt/pornonas_smartphone_photo_backup/       cifs    credentials=/root/.smbcredentials,rw,nounix,iocharset=utf8,file_mode=0777,dir_mode=0777 0 0' >> /etc/fstab
#echo 'user=backup
#password=xxxxxx' > /root/.smbcredentials
